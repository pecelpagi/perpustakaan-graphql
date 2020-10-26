/* eslint prop-types: 0 */
import React from "react";
import menuData from "./menu";
import { ishasProperty } from "../../utils";

import "./styles.scss";

class AppNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedMenu: "",
      activeChild: "",
    };
  }

  componentDidMount = () => {
    this.searchExpandedMenu();
  }

  searchExpandedMenu = () => {
    const { pathname } = window.location;
    const found = menuData.find((x) => {
      if (ishasProperty(x, "children")) {
        const childFound = x.children.find(child => (child.link === pathname));

        if (childFound) {
          this.setState({ activeChild: childFound.id });
        }

        return !!childFound;
      }

      return (x.link === pathname);
    });

    if (found) {
      this.setState({ expandedMenu: found.id });
    }
  }

  setMenuExpanded = (val) => {
    this.setState({ expandedMenu: val });
  }

  renderMenu = () => {
    const { expandedMenu, activeChild } = this.state;
    const menu = [];

    menuData.forEach((x) => {
      const isExpanded = (String(x.id) === String(expandedMenu));
      if (ishasProperty(x, "children")) {
        menu.push(
            <li key={x.id} className={`nav-parent ${isExpanded ? "nav-expanded" : ""}`}>
                <a onClick={() => this.setMenuExpanded(isExpanded ? "" : x.id)}><i className={x.icon} />{x.title}</a>
                <ul className="nav-children">
                    {x.children.map(child => (
                        <li key={child.id} className={String(activeChild) === String(child.id) ? "active" : ""}>
                            <a href={child.link}>{child.title}</a>
                        </li>
                    ))}
                </ul>
            </li>,
        );
      } else {
        menu.push(
                <li key={x.id} className={`${isExpanded ? "nav-expanded" : ""}`}>
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
    return (
      <div className="sidebar">
        {this.renderMenu()}
      </div>
    );
  }
}

export default AppNavigation;
