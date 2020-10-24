/* eslint prop-types: 0 */
import React from "react"; // eslint-disable-line no-unused-vars
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AppNavigation from "./components/AppNavigation";

require("../sass/styles.scss");

const RedirectToDashboard = () => (
    <Redirect
      to={{
        pathname: "/dashboard",
      }}
    />
);
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (<Component {...props} />)
    }
  />
);
class App extends React.Component {
  render = () => (
    <Router>
      <Switch>
        <Route path="/">
            <div>
                <AppNavigation />
                <Route exact path="/" component={RedirectToDashboard} />
                <PrivateRoute path="/dashboard" component={asyncComponent(() => import("../pages/Dashboard"))} />
                <PrivateRoute path="/auth/login" component={asyncComponent(() => import("../pages/Login"))} />
            </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
