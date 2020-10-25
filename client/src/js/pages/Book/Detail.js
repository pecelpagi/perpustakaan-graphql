/* eslint prop-types: 0 */
import React from "react";

class BookDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Book Detail",
    };
  }

  componentDidMount = () => {
    const { match: { params } } = this.props;

    if (params.type === 'edit') {
      this.setState({ title: `Edit Book Detail: ${params.id}` });
    } else {
      this.setState({ title: "Create Book" });
    }
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

export default BookDetail;
