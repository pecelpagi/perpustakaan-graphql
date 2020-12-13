const mongoose = require('mongoose');
const moment = require("moment");
const Book = require('../models/books');
const Borrowing = require('../models/borrowings');

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
            const stillBorrowing = await Borrowing.findOne({ member_id: args.member_id, return_date: '-' });

            if (stillBorrowing) {
                throw new Error("Buku belum dikembalikan");
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
            };
            let borrowBook = await Borrowing.create(payload);

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