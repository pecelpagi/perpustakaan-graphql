import { gql } from "@apollo/client";
import * as Util from "../utils";

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


export const getCategories = async () => {
  const res = await Util.graphqlClient
    .query({
      query: gql`
                  query {
                      categories {
                          id
                          code
                          name
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
