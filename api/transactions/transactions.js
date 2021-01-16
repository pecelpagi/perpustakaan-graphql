const mongoose = require('mongoose');
const moment = require("moment");
const Book = require('../models/books');
const Borrowing = require('../models/borrowings');
const Setting = require('../models/settings');

const SETTING_ID = "6002613c7d1e3d54499662c3";

const createCode = (length = 8) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const transactions = {
    borrowBook: async (args) => {
        let retval = null;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // moment().diff(moment('2020-12-27', 'YYYY-MM-DD'), 'days')

            // jumlah yang belum dikembalikan
            const borrowingLength = await Borrowing.countDocuments({
                return_date: "-",
                member_id: args.member_id,
            });

            const settingData = await Setting.findById(SETTING_ID);

            if (borrowingLength >= settingData.max_loan_qty) {
                throw new Error(`Maksimal peminjaman ${settingData.max_loan_qty} buku`);
            }

            const book = await Book.findById(args.book_id).session(session);

            if (!book) {
                throw new Error("Buku tidak ditemukan");
            }

            if (book.qty < 1) {
                throw new Error("Stok buku kosong");
            }
            book.qty = parseInt(book.qty, 10) - 1;
            book.on_loan_qty = parseInt(book.on_loan_qty, 10) + 1;

            await book.save();

            const payload = {
                code: createCode(),
                book_id: args.book_id,
                member_id: args.member_id,
                borrow_date: args.borrow_date,
                return_date: '-',
                late_charge: 0,
            };
            let borrowBook = await Borrowing.create([payload], { session: session });

            // commit the changes if everything was successful
            await session.commitTransaction();

            retval = borrowBook;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            // ending the session
            session.endSession();
        }

        return retval;
    },
    returnBook: async (args) => {
        let retval = null;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const borrowing = await Borrowing.findById(args.id);

            if (!borrowing) {
                throw new Error("Data tidak ditemukan");
            }

            const book = await Book.findById(borrowing.book_id).session(session);

            if (!book) {
                throw new Error("Buku tidak ditemukan");
            }

            book.qty = parseInt(book.qty, 10) + 1;
            book.on_loan_qty = parseInt(book.on_loan_qty, 10) - 1;

            await book.save();

            const payload = {
                return_date: moment().format('YYYY-MM-DD'),
            };
            retval = await Borrowing.findByIdAndUpdate(args.id, payload);

            // commit the changes if everything was successful
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            // ending the session
            session.endSession();
        }

        return retval;
    }
}

module.exports = transactions;