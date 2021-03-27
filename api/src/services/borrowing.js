const Borrowing = require('../models/borrowings');
const transactions = require('../transactions/transactions');

export const getBorrowings = async (args) => {
    let filter = {};

    if (args.search) {
        filter = {
            code: new RegExp(args.search, "i"),
        }
    }

    let findData = Borrowing.find(filter);

    if (args.skip) {
        findData = findData.skip(args.skip);
    }

    if (args.limit) {
        findData = findData.limit(args.limit);
    }

    const borrowings = await findData;

    return borrowings;
}

export const getBorrowing = async (args) => {
    const borrowing = await Borrowing.findById(args.id);
    return borrowing;
}

export const borrowBook = async (args) => {
    const result = await transactions.borrowBook(args);

    return result;
}

export const returnBook = async (args) => {
    const result = await transactions.returnBook(args);

    return result;
}