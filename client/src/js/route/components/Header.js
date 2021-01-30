/* eslint prop-types: 0 */
import React from "react";
import "./styles.scss";
import {
  getToken, removeToken, getDecodedToken, ishasProperty,
} from "../../utils";
import * as graphqlApi from "../../data";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "-",
      title: "Perpustakaan",
      isShowingDropdown: false,
    };
  }

  componentDidMount = () => {
    this.setupFullname();
  }

  setupFullname = async () => {
    let fullname = "Administrator";
    const decodedToken = getDecodedToken();

    if (decodedToken && ishasProperty(decodedToken, "member_id")) {
      const res = await graphqlApi.getMember(decodedToken.member_id);
      fullname = res.member.name;
    }

    this.setState({ fullname });
  }

  navToLogin = () => {
    location.href = "/auth/login";
  }

  showDropdown = () => {
    const { isShowingDropdown } = this.state;

    this.setState({ isShowingDropdown: !isShowingDropdown });
  }

  logout = (e) => {
    e.preventDefault();

    removeToken();
    location.href = "/auth/login";
  }

  renderAuthComponent = (isShowingDropdown) => {
    const { fullname } = this.state;
    const isAuthenticated = (getToken() && getToken().length > 0);

    if (isAuthenticated) {
      return (
        <div className={`dropdown ${isShowingDropdown ? "open" : ""}`}>
          <button className="btn btn-default dropdown-toggle" type="button" onClick={this.showDropdown}>
            <span><i className="fa fa-user" /></span>
                            &nbsp;
                            &nbsp;
                            {fullname}
                            {" "}
            <span><i className="fa fa-angle-down" /></span>
          </button>
          <ul className="dropdown-menu">
            <li><a href="/ubah-password">Ubah Password</a></li>
            <li><a href="#" onClick={this.logout}>Logout</a></li>
          </ul>
        </div>
      );
    }

    return (
      <button className="btn btn-default" type="button" onClick={this.navToLogin}>
        <span><i className="fa fa-lock" /></span>
        &nbsp;
        Login
      </button>
    );
  }

  render() {
    const { title, isShowingDropdown } = this.state;

    return (
      <div className="header">
        <div className="logo">
          <a href="#">{title}</a>
        </div>
        <div className="account-menu">
          {this.renderAuthComponent(isShowingDropdown)}
        </div>
      </div>
    );
  }
}

export default Header;
