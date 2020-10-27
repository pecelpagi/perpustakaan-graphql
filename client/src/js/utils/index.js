/* eslint prop-types: 0 */
import _ from "lodash";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const graphqlClient = new ApolloClient({
  uri: "http://localhost:3301/graphql",
  cache: new InMemoryCache(),
});

export const getToken = () => localStorage.getItem("usertoken");

export const setToken = (_token) => {
  localStorage.setItem("usertoken", _token); // eslint-disable-line no-undef
};

export const removeToken = () => {
  localStorage.removeItem("usertoken"); // eslint-disable-line no-undef
};

export const getBasePath = () => {
  let currentLink = String(window.location.pathname).substring(1);

  if (currentLink.split("/").length > 0) {
    [currentLink] = currentLink.split("/");
  }

  return currentLink;
};

export const ishasProperty = (obj, key) => Object.hasOwnProperty.call(obj, key);
