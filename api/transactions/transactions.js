const mongoose = require('mongoose');
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
        let retval = {};
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const book = await Book.findById(args.book_id).session(session);

            if (book.qty < 1) {
                throw new Error("Book is empty");
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
            console.error(error);
            throw error;
        } finally {
            // ending the session
            session.endSession();
        }

        return retval;
    }
}

module.exports = transactions;