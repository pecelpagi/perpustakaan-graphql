/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import Select from "./Select";
import InputText from "./InputText";

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

  renderFilterText = () => {
    return (
      <InputText
        placeholder="Pencarian ..."
        value=""
        changeEvent={() => { }}
        required
      />
    );
  }

  renderLimitData = () => {
    const limitData = [
      { id: "5", name: "5" },
      { id: "10", name: "10" },
      { id: "20", name: "20" },
      { id: "50", name: "50" },
      { id: "100", name: "100" },
    ];

    return (
      <Select
        data={limitData}
        value="5"
        changeEvent={() => { }}
      />
    );
  }

  renderTableHeader = columns => (
    <thead>
      <tr>
        {columns.map(x => (<th key={x.id}>{x.title}</th>))}
      </tr>
    </thead>
  )

  renderTableBody = (columns, data) => (
    <tbody>
      {data.map((x, i) => (
        <tr key={i}>
          {columns.map(col => (<td key={`${i}${col.id}`}>{x[col.id]}</td>))}
        </tr>
      ))}
    </tbody>
  )

  renderTable = () => {
    const { columns, data } = this.props;

    return (
      <table className="table table-bordered mb-reset">
        {this.renderTableHeader(columns)}
        {this.renderTableBody(columns, data)}
      </table>
    );
  }

  renderComponent = (withWrapperRender) => {
    if (withWrapperRender) {
      // render with wrapper
      return withWrapperRender({
        InputSearch: this.renderFilterText,
        PageSize: this.renderLimitData,
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
