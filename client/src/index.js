/* eslint prop-types: 0 */
import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import App from "~/route"; // eslint-disable-line no-unused-vars
import * as Util from "./js/utils";

const wrapper = document.getElementById("root"); // eslint-disable-line no-undef
wrapper // eslint-disable-line no-unused-expressions
  ? ReactDOM.render(
    <ApolloProvider client={Util.graphqlClient}>
      <App />
    </ApolloProvider>, wrapper,
  )
  : false;
