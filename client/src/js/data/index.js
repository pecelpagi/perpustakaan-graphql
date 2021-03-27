import { gql } from "@apollo/client";
import * as Util from "../utils";

const CollectionType = {
  CATEGORY: "Category",
  BOOK: "Book",
  MEMBER: "Member",
  BORROWING: "Borrowing",
  ATTENDANCE: "Attendance",
};

export const getRegistrationNumber = async () => {
  const res = await Util.graphqlClient
    .query({
      query: gql`
                  query {
                      auto_code {
                          registration_number
                      }
                  }
    `,
    });

  return res.data.auto_code.registration_number;
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

export const getBooks = async (payload) => {
  const res = await Util.graphqlClient
    .query({
      variables: Object.assign({}, payload, { collection: CollectionType.BOOK }),
      query: gql`
                  query Books($skip: Int, $limit: Int, $category_id: String, $collection: String, $search: String) {
                      books(skip: $skip, limit: $limit, category_id: $category_id, search: $search) {
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
      fetchPolicy: "no-cache",
      variables: Object.assign({}, payload, { collection: CollectionType.CATEGORY }),
      query: gql`
                  query Categories($skip: Int, $limit: Int, $collection: String, $search: String) {
                      categories(skip: $skip, limit: $limit, search: $search) {
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

export const getSetting = async () => {
  const res = await Util.graphqlClient
    .query({
      query: gql`
                  query Setting {
                      setting {
                        late_charge,
                        max_loan_duration,
                        max_loan_qty,
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

export const updateSetting = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation UpdateSetting($late_charge: Float!, $max_loan_duration: Int!, $max_loan_qty: Int!) {
                    updateSetting(late_charge: $late_charge, max_loan_duration: $max_loan_duration, max_loan_qty: $max_loan_qty) {
                      late_charge
                      max_loan_duration
                      max_loan_qty
                    }
                }
                `,
    });

  return res.data.updateSetting;
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
                        on_loan_qty
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

export const getAttendances = async (payload) => {
  const variables = Object.assign({}, payload, { collection: CollectionType.ATTENDANCE, token: Util.getToken() });
  const res = await Util.graphqlClient
    .query({
      variables,
      query: gql`
                  query Attendances($token: String!, $skip: Int, $limit: Int, $collection: String) {
                      attendances(token: $token, skip: $skip, limit: $limit) {
                          id
                          registration_number
                          attendance_date
                          member {
                            id
                            name
                          }
                      }
                      meta_data(collection: $collection, limit: $limit) {
                        total_page
                      }
                  }
    `,
    });

  return res.data;
};

export const getMember = async (id) => {
  const res = await Util.graphqlClient
    .query({
      variables: { id },
      query: gql`
                  query Member($id: ID!) {
                      member(id: $id) {
                        id
                        registration_number
                        name
                        address
                        email
                        phone
                      }
                  }
    `,
    });

  return res.data;
};


export const createMember = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation AddMember(
                    $registration_number: String!, $name: String!, $address: String!,
                    $email: String!, $phone: String!
                ) {
                    addMember(
                      registration_number: $registration_number, name: $name, address: $address,
                      email: $email, phone: $phone
                    ) {
                      id
                      registration_number
                      name
                      address
                      email
                      phone
                    }
                }
                `,
    });

  return res.data.addMember;
};

export const updateMember = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation UpdateMember(
                    $id: ID!, $registration_number: String!, $name: String!, $address: String!,
                    $email: String!, $phone: String!
                ) {
                    updateMember(
                      id: $id, registration_number: $registration_number, name: $name, address: $address,
                      email: $email, phone: $phone
                    ) {
                      id
                      registration_number
                      name
                      address
                      email
                      phone
                    }
                }
                `,
    });

  return res.data.updateMember;
};

export const deleteMember = async (id) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: { id },
      mutation: gql`
                mutation DeleteMember($id: ID!) {
                    deleteMember(id: $id) {
                      id
                      registration_number
                      name
                      address
                      email
                      phone
                    }
                }
                `,
    });

  return res.data.deleteMember;
};

export const getBorrowings = async (payload) => {
  const res = await Util.graphqlClient
    .query({
      fetchPolicy: "no-cache",
      variables: Object.assign({}, payload, { collection: CollectionType.BORROWING }),
      query: gql`
                  query Borrowings($skip: Int, $limit: Int, $collection: String) {
                      borrowings(skip: $skip, limit: $limit) {
                        id
                        code
                        book {
                          id
                          code
                          title
                        }
                        member {
                          id
                          registration_number
                          name
                        }
                        borrow_date
                        return_date
                        max_return_date
                        late_charge
                      }
                      meta_data(collection: $collection, limit: $limit) {
                        total_page
                      }
                  }
    `,
    });

  return res.data;
};

export const borrowBook = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation BorrowBook($book_id: String!, $member_id: String!, $borrow_date: String!) {
                    borrowBook(book_id: $book_id, member_id: $member_id, borrow_date: $borrow_date) {
                      id
                      code
                      book_id
                      member_id
                      borrow_date
                      return_date
                    }
                }
                `,
    });

  return res.data.borrowBook;
};

export const returnBook = async (id) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: { id },
      mutation: gql`
                mutation ReturnBook($id: ID!) {
                    returnBook(id: $id) {
                      id
                      code
                      book_id
                      member_id
                      borrow_date
                      return_date
                    }
                }
                `,
    });

  return res.data.borrowBook;
};

export const getBorrowing = async (id) => {
  const res = await Util.graphqlClient
    .query({
      variables: { id },
      query: gql`
                  query Borrowing($id: ID!) {
                    borrowing(id: $id) {
                      id
                      code
                      book {
                        id
                        code
                        title
                      }
                      member {
                        id
                        registration_number
                        name
                      }
                      borrow_date
                      return_date
                    }
                  }
    `,
    });

  return res.data;
};

export const updatePassword = async (payload) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: payload,
      mutation: gql`
                mutation UpdatePassword($username: String!, $old_password: String!, $new_password: String!, $confirm_new_password: String!) {
                    updatePassword(username: $username, old_password: $old_password, new_password: $new_password, confirm_new_password: $confirm_new_password) {
                      username
                    }
                }
                `,
    });

  return res.data.borrowBook;
};

export const addAttendance = async (registrationNumber) => {
  const res = await Util.graphqlClient
    .mutate({
      variables: { registration_number: registrationNumber },
      mutation: gql`
                mutation AddAttendance($registration_number: String!) {
                    addAttendance(registration_number: $registration_number) {
                      id
                      registration_number
                      attendance_date
                    }
                }
                `,
    });

  return res.data.addAttendance;
};
