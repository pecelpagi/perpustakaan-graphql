const Book = require('../models/books');
const Category = require('../models/categories');
const Member = require('../models/members');
const Attendance = require('../models/attendances');
const Borrowing = require('../models/borrowings');

export const getMetaData = async (args) => {
    let filter = {};
    let totalPage = 0;

    if (args.search) {
        filter = {
            name: new RegExp(args.search, "i"),
        }
    }

    if (args.collection === 'Category') {
        const totalData = await Category.countDocuments(filter);
        totalPage = Math.ceil(totalData / args.limit);
    } else if(args.collection === 'Book') {
        const totalData = await Book.countDocuments(filter);
        totalPage = Math.ceil(totalData / args.limit);
    } else if(args.collection === 'Member') {
        const totalData = await Member.countDocuments(filter);
        totalPage = Math.ceil(totalData / args.limit);
    } else if(args.collection === 'Borrowing') {
        const totalData = await Borrowing.countDocuments(filter);
        totalPage = Math.ceil(totalData / args.limit);
    } else if(args.collection === 'Attendance') {
        const totalData = await Attendance.countDocuments(filter);
        totalPage = Math.ceil(totalData / args.limit);
    }

    return {
        total_page: totalPage,
    };
}