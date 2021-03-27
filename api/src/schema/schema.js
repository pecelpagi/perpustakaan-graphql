const graphql = require('graphql');

import * as SchemaType from './SchemaType';
import * as ApiController from '../ApiController';
import { withVerifyToken } from './utils';

const {
    GraphQLObjectType, GraphQLString, GraphQLSchema,
    GraphQLID, GraphQLList, GraphQLInt,
    GraphQLNonNull, GraphQLFloat
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        auto_code: {
            type: SchemaType.AutoCodeType,
            resolve: async () => {
                const registrationNumber = await ApiController.getRegistrationNumber();

                return { registration_number: registrationNumber };
            }
        },
        users: {
            type: new GraphQLList(SchemaType.UserType),
            resolve: () => ApiController.getUsers()
        },
        borrowings: {
            type: new GraphQLList(SchemaType.BorrowType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve: (parent, args) => ApiController.getBorrowings(args)
        },
        members: {
            type: new GraphQLList(SchemaType.MemberType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve: (parent, args) => ApiController.getMembers(args)
        },
        attendances: withVerifyToken({
            type: new GraphQLList(SchemaType.AttendanceType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolveAfterVerify: (parent, args) => ApiController.getAttendances(args)
        }),
        categories: {
            type: new GraphQLList(SchemaType.CategoryType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve: (parent, args) => ApiController.getCategories(args) 
        },
        books: {
            type: new GraphQLList(SchemaType.BookType),
            args: { 
                skip: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                search: { type: GraphQLString },
                category_id: { type: GraphQLString },
            },
            resolve: (parent, args) => ApiController.getBooks(args) 
        },
        meta_data: {
            type: SchemaType.MetaDataType,
            args: {
                collection: { type: GraphQLString },
                limit: {type: GraphQLInt },
                search: { type: GraphQLString },
            },
            resolve: (parent, args) => ApiController.getMetaData(args) 
        },
        member: {
            type: SchemaType.MemberType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.getMember(args.id)
        },
        category: {
            type: SchemaType.CategoryType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.getCategory(args.id)
        },
        book: {
            type: SchemaType.BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => ApiController.getBook(args.id)
        },
        borrowing: {
            type: SchemaType.BorrowType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.getBorrowing(args)
        },
        setting: {
            type: SchemaType.SettingType,
            resolve: () => ApiController.getSetting()
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAttendance: {
            type: SchemaType.AttendanceType,
            args: {
                registration_number: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.addAttendance(args)
        },
        borrowBook: {
            type: SchemaType.BorrowType,
            args: {
                book_id: { type: new GraphQLNonNull(GraphQLString) },
                member_id: { type: new GraphQLNonNull(GraphQLString) },
                borrow_date: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.borrowBook(args)
        },
        returnBook: {
            type: SchemaType.BorrowType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.returnBook(args)
        },
        addCategory: {
            type: SchemaType.CategoryType,
            args: {
                code: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.addCategory(args)
        },
        updateCategory: {
            type: SchemaType.CategoryType,
            args: {
                id: { type: GraphQLID },
                code: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.updateCategory(args)
        },
        deleteCategory: {
            type: SchemaType.CategoryType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.deleteCategory(args)
        },
        addBook: {
            type: SchemaType.BookType,
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
            resolve: (parent, args) => ApiController.addBook(args)
        },
        updateBook: {
            type: SchemaType.BookType,
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
            resolve: (parent, args) => ApiController.updateBook(args),
        },
        deleteBook: {
            type: SchemaType.BookType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.deleteBook(args),
        },
        addMember: {
            type: SchemaType.MemberType,
            args: {
                registration_number: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.addMember(args),
        },
        updateMember: {
            type: SchemaType.MemberType,
            args: {
                id: { type: GraphQLID },
                registration_number: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.updateMember(args),
        },
        deleteMember: {
            type: SchemaType.MemberType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => ApiController.deleteMember(args),
        },
        updateSetting: {
            type: SchemaType.SettingType,
            args: {
                late_charge: { type: new GraphQLNonNull(GraphQLFloat) },
                max_loan_qty: { type: new GraphQLNonNull(GraphQLInt) },
                max_loan_duration: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => ApiController.updateSetting(args),
        },
        updatePassword: {
            type: SchemaType.UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                old_password: { type: new GraphQLNonNull(GraphQLString) },
                new_password: { type: new GraphQLNonNull(GraphQLString) },
                confirm_new_password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.updatePassword(args),
        },
        login: {
            type: SchemaType.LoginType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => ApiController.login(args),
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})