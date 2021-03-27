const Book = require('../models/books');

export const getBooks = async (args) => {
    let filter = {};

    if (args.search) {
        filter = {
            $text: {
                $search: String(args.search),
                $caseSensitive: false,
            },
        }
    }

    if (args.category_id) {
        Object.assign(filter, {
            category_id: args.category_id
        });
    }

    let findData = Book.find(filter);

    if (args.skip) {
        findData = findData.skip(args.skip);
    }

    if (args.limit) {
        findData = findData.limit(args.limit);
    }

    const books = await findData;

    return books;
}

export const getBook = async (bookId) => {
    const book = await Book.findById(bookId);
    return book;
}

export const addBook = async (args) => {
    const filter = {
        code: new RegExp(args.code, "i"),
    };
    const findData = await Book.find(filter);
    const newCode = `${args.code}.${findData.length + 1}`;

    const payload = Object.assign({}, args, {
        code: newCode,
        on_loan_qty: 0,
    });
    const book = new Book(payload);

    return book.save();
}

export const updateBook = async (args) => {
    const result = await Book.findByIdAndUpdate(args.id, args);           

    return result;
}

export const deleteBook = async (args) => {
    const result = await Book.findByIdAndRemove(args.id);
    
    return result;
}