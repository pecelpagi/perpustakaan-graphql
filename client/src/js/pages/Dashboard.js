/* eslint prop-types: 0 */
import React from "react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Dashboard Page",
    };
  }

  render() {
    const { title } = this.state;

    return (
      <div>
        <h1>{title}</h1>
      </div>
    );
  }
}

export default Dashboard;
