const graphql = require('graphql');
const jwt = require("jsonwebtoken");
const Constants = require('../constants');

const {
    GraphQLString, GraphQLNonNull,
} = graphql;


import { isHasProperty } from '../utils';

const verifyToken = (token) => {
    const data = jwt.verify(token, Constants.SECRET_KEY);

    return data;
}

export const withVerifyToken = (schema) => {
    const newSchema = schema;
    const hasArgs = isHasProperty(schema, 'args');

    let newArgs = Object.assign({}, {
        token: { type: new GraphQLNonNull(GraphQLString) },
    });

    if (hasArgs) newArgs = Object.assign({}, newArgs, schema.args);

    Object.assign(newSchema, { args: newArgs });
    
    const newResolve = async (parent, args) => {
        const decodedToken = verifyToken(args.token);
        const isMember = isHasProperty(decodedToken.data, 'member_id');

        const payload = args;

        if (isMember) Object.assign(payload, { member_id: decodedToken.data.member_id });

        const result = await schema.resolveAfterVerify(parent, payload);
        
        return result;
    }

    Object.assign(newSchema, { resolve: newResolve });

    return newSchema;
}