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

    if (hasArgs) newArgs = Object.assign({}, schema.args);

    Object.assign(newSchema, { args: newArgs });
    
    const newResolve = async (parent, args) => {
        verifyToken(args.token);

        const result = await schema.resolveAfterVerify(parent, args);
        
        return result;
    }

    Object.assign(newSchema, { resolve: newResolve });

    return newSchema;
}