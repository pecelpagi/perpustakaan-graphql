/* eslint prop-types: 0 */
import React from "react";

import "./styles.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Perpustakaan",
    };
  }


  render() {
    const { title } = this.state;

    return (
      <div className="header">
        <div className="logo">
            <a href="#">{title}</a>
        </div>
      </div>
    );
  }
}

export default Header;
