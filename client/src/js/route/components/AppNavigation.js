/* eslint prop-types: 0 */
import React from "react";
import menuData from "./menu";
import { ishasProperty } from "../../utils";

import "./styles.scss";

class AppNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuState: menuData,
      expandedMenu: "",
    };
  }

  setMenuExpanded = (val) => {
    this.setState({ expandedMenu: val });
  }

  renderMenu = () => {
    const { menuState, expandedMenu } = this.state;
    const menu = [];

    menuState.forEach((x) => {
      const isExpanded = (x.id === expandedMenu);
      if (ishasProperty(x, "children")) {
        menu.push(
            <li className={`nav-parent ${isExpanded ? "nav-expanded" : ""}`}>
                <a onClick={() => this.setMenuExpanded(isExpanded ? "" : x.id)}><i className={x.icon} />{x.title}</a>
                <ul className="nav-children">
                    {x.children.map(child => (
                        <li>
                            <a href={child.link}>{child.title}</a>
                        </li>
                    ))}
                </ul>
            </li>,
        );
      } else {
        menu.push(
                <li className={`${isExpanded ? "nav-expanded" : ""}`}>
                    <a onClick={() => this.setMenuExpanded(x.id)} href={x.link} ><i className={x.icon} />{x.title}</a>
                </li>,
        );
      }
    });

    return (
        <ul className="sidebar-nav">{menu}</ul>
    );
  }

  render() {
    const { title } = this.state;

    return (
      <div className="sidebar">
        {this.renderMenu()}
      </div>
    );
  }
}

export default AppNavigation;
