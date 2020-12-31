/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import Select from "./Select";
import InputText from "./InputText";
import { ishasProperty } from "../utils";

const limitData = [
  { id: "5", name: "5" },
  { id: "10", name: "10" },
  { id: "20", name: "20" },
  { id: "50", name: "50" },
  { id: "100", name: "100" },
];
class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })).isRequired,
    onFetch: PropTypes.func,
    withWrapperRender: PropTypes.func,
    rowClick: PropTypes.func,
  }

  static defaultProps = {
    withWrapperRender: undefined,
    onFetch: () => {},
    rowClick: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      limit: "5",
      page: 0,
      totalPage: 0,
      filterText: "",
      isFetching: false,
    };
  }

  componentDidMount = () => {
    this.forceRefetch();
  }

  setFetching = (isFetching) => {
    this.setState({ isFetching });
  }

  fetchData = async (state) => {
    const { onFetch } = this.props;

    this.setFetching(true);

    const { data, totalPage = 0 } = await onFetch(state);

    this.setFetching(false);

    this.setState({ data, totalPage: parseInt(totalPage, 10) });
  };

  forceRefetch = () => {
    const { page, limit, filterText } = this.state;
    this.fetchData({ skip: page * parseInt(limit, 10), limit: parseInt(limit, 10), search: filterText });
  };

  onSearch = (val) => {
    this.setState({ filterText: val });

    clearTimeout(this.filterIdle);
    this.filterIdle = setTimeout(() => {
      // TODO: be aware remove other filter
      this.setState({ filterText: val }, () => {
        this.forceRefetch();
      });
    }, 500);
  }

  renderFilterText = () => {
    const { filterText } = this.state;

    return (
      <InputText
        placeholder="Pencarian ..."
        value={filterText}
        changeEvent={this.onSearch}
        required
      />
    );
  }

  onChangeLimitData = (val) => {
    this.setState({ limit: val, page: 0 }, () => {
      this.forceRefetch();
    });
  }

  renderLimitData = () => {
    const { limit } = this.state;
    return (
      <Select
        data={limitData}
        value={limit}
        changeEvent={this.onChangeLimitData}
      />
    );
  }

  createStyleColumnHeader = (obj) => {
    if (ishasProperty(obj, "width")) {
      return { width: obj.width };
    }

    return {};
  }

  renderTableHeader = columns => (
    <thead>
      <tr>
        {columns.map(x => (<th key={x.id} style={this.createStyleColumnHeader(x)}>{x.title}</th>))}
      </tr>
    </thead>
  )

  renderTableBody = (columns, data) => {
    const { rowClick } = this.props;
    const emptyData = (
      <tr>
        <td colSpan={columns.length} className="text-center">Tidak ada data</td>
      </tr>
    );

    return (
      <tbody>
        {data.length === 0 && (emptyData)}
        {data.map((x, i) => (
          <tr key={i} onClick={() => { rowClick(x); }}>
            {columns.map(col => (<td key={`${i}${col.id}`}>{ishasProperty(col, "customComponent") ? col.customComponent(x[col.id]) : x[col.id]}</td>))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderTable = () => {
    const { data, isFetching } = this.state;
    const { columns } = this.props;

    return (
      <div className="position-relative">
        <table className="table table-hover mb-reset">
          {this.renderTableHeader(columns)}
          {this.renderTableBody(columns, data)}
        </table>
        {this.renderPagination()}
        { isFetching && (
          <div style={{
            position: "absolute",
            top: "37px",
            height: "83%",
            background: "rgba(255, 255, 255, 0.45)",
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>Loading ...</div>
        )}
      </div>
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

  onClickPage = (val) => {
    this.setState({ page: val }, () => {
      this.forceRefetch();
    });
  }

  onPrev = (disabled) => {
    if (!disabled) {
      const { page } = this.state;
      this.setState({ page: (page - 1) }, () => {
        this.forceRefetch();
      });
    }
  }

  onNext = (disabled) => {
    if (!disabled) {
      const { page } = this.state;
      this.setState({ page: (page + 1) }, () => {
        this.forceRefetch();
      });
    }
  }

  renderPagination = () => {
    const { totalPage, page } = this.state;
    const pages = [];
    const disablePrev = (page === 0);
    const disableNext = (page === (totalPage - 1));

    for (let i = 0; i < totalPage; i += 1) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === page ? "active" : ""}`}>
            <a className="page-link" onClick={() => this.onClickPage(i)}>{i + 1}</a>
          </li>,
      );
    }

    return (
      <ul className="pagination mb-reset" style={{ float: "right" }}>
        <li className={`page-item ${disablePrev ? "disabled" : ""}`}>
          <a className="page-link" onClick={() => this.onPrev(disablePrev)}>
            <span>&laquo;</span>
            <span className="sr-only">Previous</span>
          </a>
        </li>
        {pages}
        <li className={`page-item ${disableNext ? "disabled" : ""}`}>
          <a className="page-link" onClick={() => this.onNext(disableNext)}>
            <span>&raquo;</span>
            <span className="sr-only">Next</span>
          </a>
        </li>
      </ul>
    );
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
