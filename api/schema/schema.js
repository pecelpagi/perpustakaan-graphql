const graphql = require('graphql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const Constants = require('../constants');
const User = require('../models/users');
const Category = require('../models/categories');
const Book = require('../models/books');
const Member = require('../models/members');
const Borrowing = require('../models/borrowings');

const transactions = require('../transactions/transactions');

const {
    GraphQLObjectType, GraphQLString, GraphQLSchema,
    GraphQLID, GraphQLList, GraphQLBoolean, GraphQLInt,
    GraphQLNonNull,
} = graphql;

const verifyToken = (token) => {
    const data = jwt.verify(token, Constants.SECRET_KEY);
    return data;
}

const BorrowType = new GraphQLObjectType({
    name: 'Borrow',
    fields: () => ({
        id: { type: GraphQLID },
        code: { type: GraphQLString },
        book_id: { type: GraphQLString },
        book: {
            type: BookType,
            resolve(parent, args) {
                return Book.findById(parent.book_id);
            }
        },
        member_id: { type: GraphQLString },
        member: {
            type: MemberType,
            resolve(parent, args) {
                return Member.findById(parent.member_id);
            }
        },
        borrow_date: { type: GraphQLString },
        return_date: { type: GraphQLString },
    }),
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        passwd: { type: GraphQLString },
        fullname: { type: GraphQLString },
    }),
});

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        token: { type: GraphQLString },
        username: { type: GraphQLString },
        fullname: { type: GraphQLString },
    }),
});

const MemberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        id: { type: GraphQLID },
        registration_number: { type: GraphQLString },
        name: { type: GraphQLString },
        address: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        code: { type: GraphQLString },
        name: { type: GraphQLString },
    }),
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        category_id: { type: GraphQLString },
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Category.findById(parent.category_id);
            }
        },
        code: { type: GraphQLString },
        isbn: { type: GraphQLString },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publisher: { type: GraphQLString },
        city: { type: GraphQLString },
        year: { type: GraphQLInt },
        cover: { type: GraphQLString },
        qty: { type: GraphQLInt },
        on_loan_qty: { type: GraphQLInt },
    }),
});

const MetaDataType = new GraphQLObjectType({
    name: 'MetaData',
    fields: () => ({
        total_page: { type: GraphQLInt },
    }),
});

const getMetaData = async (args) => {
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
    }

    return {
        total_page: totalPage,
    };
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            }
        },
        borrowings: {
            type: new GraphQLList(BorrowType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve(parent, args) {
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

                return findData;
            }
        },
        members: {
            type: new GraphQLList(MemberType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve(parent, args) {
                let filter = {};

                if (args.search) {
                    filter = {
                        code: new RegExp(args.search, "i"),
                    }
                }

                let findData = Member.find(filter);
                
                if (args.skip) {
                    findData = findData.skip(args.skip);
                }

                if (args.limit) {
                    findData = findData.limit(args.limit);
                }

                return findData;
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve(parent, args) {
                let filter = {};

                if (args.search) {
                    filter = {
                        name: new RegExp(args.search, "i"),
                    }
                }

                let findData = Category.find(filter);
                
                if (args.skip) {
                    findData = findData.skip(args.skip);
                }

                if (args.limit) {
                    findData = findData.limit(args.limit);
                }

                return new Promise(function(resolve, reject) {
                    findData.then((res) => {
                        setTimeout(() => {
                            resolve(res);
                        }, 1);
                    })
                });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
                category_id: { type: GraphQLString },
            },
            resolve(parent, args) {
                let filter = {};

                if (args.search) {
                    filter = {
                        code: new RegExp(args.search, "i"),
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

                return findData;
            }
        },
        meta_data: {
            type: MetaDataType,
            args: {
                collection: { type: GraphQLString },
                limit: {type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve(parent, args) {
                return getMetaData(args);
            }
        },
        member: {
            type: MemberType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Member.findById(args.id);
            }
        },
        category: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Category.findById(args.id);
            }
        },
        book: {
            type: BookType,
            args: {
                // token: { type: GraphQLNonNull(GraphQLString) },
                id: { type: GraphQLID }
            },
            resolve: async (parent, args) => {
                // verifyToken(args.token);

                const retval = await Book.findById(args.id);
                return retval;
            }
        },
        borrowing: {
            type: BorrowType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
                const retval = await Borrowing.findById(args.id);
                return retval;
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        borrowBook: {
            type: BorrowType,
            args: {
                book_id: { type: new GraphQLNonNull(GraphQLString) },
                member_id: { type: new GraphQLNonNull(GraphQLString) },
                borrow_date: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return transactions.borrowBook(args);
            }
        },
        returnBook: {
            type: BorrowType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return transactions.returnBook(args);
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                code: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const filter = {
                    code: args.code,
                };
                const findData = await Category.findOne(filter);
                if (findData) {
                    throw new Error("Kode Kategori sudah digunakan");
                }

                let category = new Category({
                    code: args.code,
                    name: args.name,
                });
                return category.save();
            }
        },
        updateCategory: {
            type: CategoryType,
            args: {
                id: { type: GraphQLID },
                code: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let payload = {
                    code: args.code,
                    name: args.name,
                };
                return Category.findByIdAndUpdate(args.id, payload);
            }
        },
        deleteCategory: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Category.findByIdAndRemove(args.id);
            }
        },
        addBook: {
            type: BookType,
            args: {
                code: { type: new GraphQLNonNull(GraphQLString) },
                category_id: { type: new GraphQLNonNull(GraphQLString) },
                isbn: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) },
                publisher: { type: new GraphQLNonNull(GraphQLString) },
                city: { type: new GraphQLNonNull(GraphQLString) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
                cover: { type: new GraphQLNonNull(GraphQLString) },
                qty: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args) => {
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
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: GraphQLID },
                category_id: { type: new GraphQLNonNull(GraphQLString) },
                code: { type: new GraphQLNonNull(GraphQLString) },
                isbn: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) },
                publisher: { type: new GraphQLNonNull(GraphQLString) },
                city: { type: new GraphQLNonNull(GraphQLString) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
                cover: { type: new GraphQLNonNull(GraphQLString) },
                qty: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Book.findByIdAndUpdate(args.id, args);
            }
        },
        deleteBook: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Book.findByIdAndRemove(args.id);
            }
        },
        addMember: {
            type: MemberType,
            args: {
                registration_number: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                let retval = null;

                const filter = {
                    registration_number: args.registration_number,
                };
                const findData = await Member.findOne(filter);
                if (findData) {
                    throw new Error("Nomor induk sudah digunakan");
                }

                let member = new Member(args);
                retval = member.save();

                return retval;
            }
        },
        updateMember: {
            type: MemberType,
            args: {
                id: { type: GraphQLID },
                registration_number: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Member.findByIdAndUpdate(args.id, args);
            }
        },
        deleteMember: {
            type: MemberType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Member.findByIdAndRemove(args.id);
            }
        },
        login: {
            type: LoginType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const found = await User.findOne({ username: args.username });
                let data = {};
                let isPasswordValid = false;

                if (found) {
                    isPasswordValid = bcrypt.compareSync(args.password, found.passwd);
                    data = found;
        
                    delete data.passwd;
                }

                let retval = {
                    "token": "",
                    "username": "",
                    "fullname": "",
                };

                if (isPasswordValid) {
                    retval = {
                        "token": jwt.sign({ data }, Constants.SECRET_KEY, { expiresIn: '17520h' }),
                        "username": data.username,
                        "fullname": data.fullname
                    }
                }

                return retval;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})