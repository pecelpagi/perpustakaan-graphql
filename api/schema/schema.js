const graphql = require('graphql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require('../constants');
const User = require('../models/users');
const Category = require('../models/categories');
const Book = require('../models/books');

const {
    GraphQLObjectType, GraphQLString, GraphQLSchema,
    GraphQLID, GraphQLList, GraphQLBoolean, GraphQLInt,
    GraphQLNonNull,
} = graphql;

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
        code: { type: GraphQLString },
        isbn: { type: GraphQLInt },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publisher: { type: GraphQLString },
        city: { type: GraphQLString },
        year: { type: GraphQLInt },
        cover: { type: GraphQLString },
        qty: { type: GraphQLInt },
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
            },
            resolve(parent, args) {
                let filter = {};

                if (args.search) {
                    filter = {
                        name: new RegExp(args.search, "i"),
                    }
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
        category: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Category.findById(args.id);
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCategory: {
            type: CategoryType,
            args: {
                code: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
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
                let book = new Book(args);
                return book.save();
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