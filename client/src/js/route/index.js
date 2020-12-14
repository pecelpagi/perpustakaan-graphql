/* eslint prop-types: 0 */
import React from "react"; // eslint-disable-line no-unused-vars
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AppNavigation from "./components/AppNavigation";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { getToken } from "../utils";

require("../sass/styles.scss");


const RedirectToDashboard = () => (
    <Redirect
      to={{
        pathname: "/dashboard",
      }}
    />
);

const isAuthenticated = (getToken() && getToken().length > 0);
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated ? (
      <Component {...props} {...rest} />
    ) : (
        <Redirect
          to={{
            pathname: "/auth/login",
            state: { from: props.location }, // eslint-disable-line react/prop-types
          }}
        />
    ))
    }
  />
);
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (!isAuthenticated ? (
      <Component {...props} />
    ) : (
        <Redirect
          to={{
            pathname: "/books",
          }}
        />
    ))
    }
  />
);
class App extends React.Component {
  render = () => (
    <Router>
      <Switch>
        <Route path="/">
            <div>
                <Header />
                <AppNavigation />
                <Layout>
                  <Route exact path="/" component={RedirectToDashboard} />
                  <AuthRoute path="/auth/login" component={asyncComponent(() => import("../pages/Login"))} />
                  <PrivateRoute path="/dashboard" component={asyncComponent(() => import("../pages/Dashboard"))} />
                  <PrivateRoute path="/books" component={asyncComponent(() => import("../pages/Book"))} />
                  <PrivateRoute exact path="/book/:type/:id" component={asyncComponent(() => import("../pages/Book/Detail"))} />
                  <PrivateRoute exact path="/book/:type" component={asyncComponent(() => import("../pages/Book/Detail"))} />
                  <PrivateRoute path="/categories" component={asyncComponent(() => import("../pages/Category"))} />
                  <PrivateRoute exact path="/category/:type/:id" component={asyncComponent(() => import("../pages/Category/Detail"))} />
                  <PrivateRoute exact path="/category/:type" component={asyncComponent(() => import("../pages/Category/Detail"))} />
                  <PrivateRoute path="/members" component={asyncComponent(() => import("../pages/Member"))} />
                  <PrivateRoute exact path="/member/:type/:id" component={asyncComponent(() => import("../pages/Member/Detail"))} />
                  <PrivateRoute exact path="/member/:type" component={asyncComponent(() => import("../pages/Member/Detail"))} />
                  <PrivateRoute path="/peminjaman-list" component={asyncComponent(() => import("../pages/Peminjaman"))} />
                  <PrivateRoute exact path="/peminjaman/:type/:id" component={asyncComponent(() => import("../pages/Peminjaman/Detail"))} />
                  <PrivateRoute exact path="/peminjaman/:type" component={asyncComponent(() => import("../pages/Peminjaman/Detail"))} />
                </Layout>
            </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
