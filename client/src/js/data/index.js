import { gql } from "@apollo/client";
import * as Util from "../utils";

const CollectionType = {
  CATEGORY: "Category",
  BOOK: "Book",
  MEMBER: "Member",
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

export const getBooks = async (payload) => {
  const res = await Util.graphqlClient
    .query({
      variables: Object.assign({}, payload, { collection: CollectionType.BOOK }),
      query: gql`
                  query Books($skip: Int, $limit: Int, $collection: String) {
                      books(skip: $skip, limit: $limit) {
                          id
                          code
                          title
                          author
                          cover
                          qty
                      }
                      meta_data(collection: $collection, limit: $limit) {
                        total_page
                      }
                  }
    `,
    });

  return res.data;
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

export const getCategory = async (id) => {
  const res = await Util.graphqlClient
    .query({
      variables: { id },
      query: gql`
                  query Category($id: ID!) {
                      category(id: $id) {
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

export const updateCategory = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation UpdateCategory($id: ID!, $code: String!, $name: String!) {
                    updateCategory(id: $id, code: $code, name: $name) {
                      id
                      code
                      name
                    }
                }
                `,
    });

  return res.data.updateCategory;
};

export const deleteCategory = async (id) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: { id },
      mutation: gql`
                mutation DeleteCategory($id: ID!) {
                    deleteCategory(id: $id) {
                      id
                      code
                      name
                    }
                }
                `,
    });

  return res.data.deleteCategory;
};

export const getBook = async (id) => {
  const res = await Util.graphqlClient
    .query({
      variables: { id },
      query: gql`
                  query Book($id: ID!) {
                      book(id: $id) {
                        id
                        category {
                          id
                          name
                        }
                        isbn
                        code
                        title
                        author
                        publisher
                        city
                        year
                        cover
                        qty
                      }
                  }
    `,
    });

  return res.data;
};


export const createBook = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation AddBook(
                    $code: String!, $category_id: String!, $isbn: String!, $title: String!
                    $author: String!, $publisher: String!, $city: String!
                    $year: Int!, $cover: String!, $qty: Int!
                ) {
                    addBook(
                      code: $code, category_id: $category_id, isbn: $isbn, title: $title,
                      author: $author, publisher: $publisher, city: $city,
                      year: $year, cover: $cover, qty: $qty,
                    ) {
                      id
                      code
                      title
                    }
                }
                `,
    });

  return res.data.addBook;
};

export const updateBook = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation UpdateBook(
                    $id: ID!, $code: String!, $category_id: String!, $isbn: String!, $title: String!
                    $author: String!, $publisher: String!, $city: String!
                    $year: Int!, $cover: String!, $qty: Int!
                ) {
                    updateBook(
                      id: $id, code: $code, category_id: $category_id, isbn: $isbn, title: $title,
                      author: $author, publisher: $publisher, city: $city,
                      year: $year, cover: $cover, qty: $qty,
                    ) {
                      id
                      code
                      title
                    }
                }
                `,
    });

  return res.data.updateBook;
};

export const deleteBook = async (id) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: { id },
      mutation: gql`
                mutation DeleteBook($id: ID!) {
                    deleteBook(id: $id) {
                      id
                      code
                      title
                    }
                }
                `,
    });

  return res.data.deleteBook;
};

export const getMembers = async (payload) => {
  const res = await Util.graphqlClient
    .query({
      variables: Object.assign({}, payload, { collection: CollectionType.MEMBER }),
      query: gql`
                  query Members($skip: Int, $limit: Int, $collection: String) {
                      members(skip: $skip, limit: $limit) {
                          id
                          registration_number
                          name
                          address
                          email
                          phone
                      }
                      meta_data(collection: $collection, limit: $limit) {
                        total_page
                      }
                  }
    `,
    });

  return res.data;
};
