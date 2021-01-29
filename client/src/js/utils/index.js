/* eslint prop-types: 0 */
import _ from "lodash";
import jwtDecode from "jwt-decode";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { API_BASE_URL } from "../constants";

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

export const getDecodedToken = () => {
  const decoded = jwtDecode(getToken());

  return decoded.data;
};

export const getBasePath = () => {
  let currentLink = String(window.location.pathname).substring(1);

  if (currentLink.split("/").length > 0) {
    [currentLink] = currentLink.split("/");
  }

  return currentLink;
};

export const ishasProperty = (obj, key) => Object.hasOwnProperty.call(obj, key);

export const createPathPreview = (rawPath) => {
  if (rawPath) {
    const path = rawPath.replace("public/", `${API_BASE_URL}/`);

    return path;
  }

  return rawPath;
};

export const catchError = (e) => {
  let message = "Unknown error";
  if (typeof e === "string") message = e;
  if (Object.prototype.hasOwnProperty.call(e, "message")) ({ message } = e);
  if (Object.prototype.hasOwnProperty.call(e, "error")) ({ error: message } = e);
  return message;
};
