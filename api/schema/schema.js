const graphql = require('graphql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require('../constants');
const User = require('../models/users');
const Category = require('../models/categories');

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

const MetaDataType = new GraphQLObjectType({
    name: 'MetaData',
    fields: () => ({
        total_page: { type: GraphQLInt },
    }),
});

const getMetaData = async (args) => {
    let filter = {};

    if (args.search) {
        filter = {
            name: new RegExp(args.search, "i"),
        }
    }
    const totalData = await Category.countDocuments(filter);
    const totalPage = Math.ceil(totalData / args.limit);

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