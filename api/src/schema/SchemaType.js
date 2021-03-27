const graphql = require('graphql');

import * as ApiController from '../ApiController';

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt,
    GraphQLFloat
} = graphql;

export const AutoCodeType = new GraphQLObjectType({
    name: 'AutoCode',
    fields: () => ({
        registration_number: { type: GraphQLString },
    }),
});

export const AttendanceType = new GraphQLObjectType({
    name: 'Attendance',
    fields: () => ({
        id: { type: GraphQLID },
        registration_number: { type: GraphQLString },
        attendance_date: { type: GraphQLString },
        member: {
            type: MemberType,
            resolve: (parent, args) => ApiController.getMemberByRegistrationNumber(parent.registration_number),
        },
    }),
});

export const BorrowType = new GraphQLObjectType({
    name: 'Borrow',
    fields: () => ({
        id: { type: GraphQLID },
        code: { type: GraphQLString },
        book_id: { type: GraphQLString },
        book: {
            type: BookType,
            resolve: (parent) => ApiController.getBook(parent.book_id),
        },
        member_id: { type: GraphQLString },
        member: {
            type: MemberType,
            resolve: (parent) => ApiController.getMember(parent.member_id),
        },
        borrow_date: { type: GraphQLString },
        return_date: { type: GraphQLString },
        max_return_date: { type: GraphQLString },
        late_charge: { type: GraphQLFloat },
    }),
});

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        fullname: { type: GraphQLString },
    }),
});

export const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        token: { type: GraphQLString },
        username: { type: GraphQLString },
        fullname: { type: GraphQLString },
    }),
});

export const MemberType = new GraphQLObjectType({
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

export const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        code: { type: GraphQLString },
        name: { type: GraphQLString },
    }),
});

export const SettingType = new GraphQLObjectType({
    name: 'Setting',
    fields: () => ({
        late_charge: { type: GraphQLFloat },
        max_loan_duration: { type: GraphQLInt },
        max_loan_qty: { type: GraphQLInt },
    }),
});

export const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        category_id: { type: GraphQLString },
        category: {
            type: CategoryType,
            resolve: (parent) => ApiController.getCategory(parent.category_id)
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

export const MetaDataType = new GraphQLObjectType({
    name: 'MetaData',
    fields: () => ({
        total_page: { type: GraphQLInt },
    }),
});