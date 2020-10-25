/* eslint prop-types: 0 */
import React from "react";

class Peminjaman extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Peminjaman",
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

export default Peminjaman;
