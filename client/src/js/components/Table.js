/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";

class Table extends React.Component {
    static propTypes = {
      columns: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      })).isRequired,
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      withWrapperRender: PropTypes.func,
    }

    static defaultProps = {
      withWrapperRender: undefined,
    }

    constructor(props) {
      super(props);

      this.state = {
        title: "Book",
      };
    }

  renderTableHeader = columns => (
        <thead>
            <tr>
                {columns.map(x => (<th>{x.title}</th>))}
            </tr>
        </thead>
  )

  renderTableBody = (columns, data) => (
        <tbody>
            { data.map((x, i) => (
                <tr key={i}>
                    {columns.map(col => (<td key={`${i}${col.id}`}>{x[col.id]}</td>))}
                </tr>
            ))}
        </tbody>
  )

  renderTable = () => {
    const { columns, data } = this.props;

    return (
        <table className="table table-bordered">
            {this.renderTableHeader(columns)}
            {this.renderTableBody(columns, data)}
        </table>
    );
  }

  renderComponent = (withWrapperRender) => {
    if (withWrapperRender) {
      // render with wrapper
      return withWrapperRender({
        makeTable: this.renderTable,
      });
    }

    // render without wrapper: default
    return this.renderTable();
  }

  render() {
    const { withWrapperRender } = this.props;

    return (
      <div>
        {this.renderComponent(withWrapperRender)}
      </div>
    );
  }
}

export default Table;
