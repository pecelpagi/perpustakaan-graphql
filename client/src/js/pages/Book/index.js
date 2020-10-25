/* eslint prop-types: 0 */
import React from "react";

class Book extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Book",
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

export default Book;
