import moment from 'moment';

const Borrowing = require('../models/borrowings');
const Setting = require('../models/settings');
const transactions = require('../transactions/transactions');

const updateBorrowingFine = async (id, maxReturnDateDiffToday, lateCharge) => {
    const borrowing = await Borrowing.findById(id);

    borrowing.late_charge = (maxReturnDateDiffToday * lateCharge);

    await borrowing.save();

    return borrowing;
}

export const calculateFines = async (jobDone) => {
    let response = null;

    try {
        let lateCharge = 0;
        const filter = {
            return_date: '-',
        }
        const notReturnedBooks = await Borrowing.find(filter);
        const settingData = await Setting.find();
    
        if (settingData && settingData.length > 0) lateCharge = settingData[0].late_charge;
    
        const newData = notReturnedBooks.map((x) => {
            const maxReturnDateDiffToday = moment().diff(moment(x.max_return_date, 'YYYY-MM-DD'), 'days');
            return (Object.assign({}, JSON.parse(JSON.stringify(x)), { maxReturnDateDiffToday }));
        }).filter(x => x.maxReturnDateDiffToday > 0);
    
        const promises = [];
    
        newData.forEach((x) => {
            promises.push(updateBorrowingFine(x._id, x.maxReturnDateDiffToday, lateCharge));
        });
    
        const allPromises = await Promise.all(promises);
    
        response = { success: true, updatedCount: allPromises.length };
        jobDone()
    } catch (e) {
        response = { success: false, error: e };
        jobDone(new Error(e.message));
    }

    console.log('CALCULATE-FINES: ', response);
}

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