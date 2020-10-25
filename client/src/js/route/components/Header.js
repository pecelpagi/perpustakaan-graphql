/* eslint prop-types: 0 */
import React from "react";

import "./styles.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Perpustakaan",
      isShowingDropdown: false,
    };
  }

  showDropdown = () => {
    const { isShowingDropdown } = this.state;

    this.setState({ isShowingDropdown: !isShowingDropdown });
  }

  render() {
    const { title, isShowingDropdown } = this.state;

    return (
            <div className="header">
                <div className="logo">
                    <a href="#">{title}</a>
                </div>
                <div className="account-menu">
                    {/* <button class="btn btn-default" type="button">
                            <span><i className="fa fa-lock" /></span>
                            &nbsp;
                            Login
                    </button> */}
                    <div class={`dropdown ${isShowingDropdown ? "open" : ""}`}>
                        <button class="btn btn-default dropdown-toggle" type="button" onClick={this.showDropdown}>
                            <span><i className="fa fa-user" /></span>
                            &nbsp;
                            Administrator
                            {" "}
                            <span><i className="fa fa-angle-down" /></span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#">Ubah Password</a></li>
                            <li><a href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
    );
  }
}

export default Header;
