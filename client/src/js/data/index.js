import { gql } from "@apollo/client";
import * as Util from "../utils";

const CollectionType = {
  CATEGORY: "Category",
};

export const getUsers = async () => {
  const res = await Util.graphqlClient
    .query({
      query: gql`
                  query {
                      users {
                          id
                          username
                          fullname
                      }
                  }
    `,
    });

  return res.data.users;
};


export const getCategories = async (payload) => {
  const res = await Util.graphqlClient
    .query({
      variables: Object.assign({}, payload, { collection: CollectionType.CATEGORY }),
      query: gql`
                  query Categories($skip: Int, $limit: Int, $collection: String) {
                      categories(skip: $skip, limit: $limit) {
                          id
                          code
                          name
                      }
                      meta_data(collection: $collection, limit: $limit) {
                        total_page
                      }
                  }
    `,
    });

  return res.data;
};

export const login = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation Login($username: String!, $password: String!) {
                    login(username: $username, password: $password) {
                        token
                        username
                        fullname
                    }
                }
  `,
    });

  return res.data.login;
};

export const createCategory = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation AddCategory($code: String!, $name: String!) {
                    addCategory(code: $code, name: $name) {
                      id
                      code
                      name
                    }
                }
  `,
    });

  return res.data.addCategory;
};
