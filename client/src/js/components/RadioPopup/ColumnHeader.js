/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";

class ColumnHeader extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      accessor: PropTypes.string,
      Header: PropTypes.string,
      width: PropTypes.string,
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      scrollIndex: undefined,
      checkedId: "",
    };
  }

  sortHandler = (fieldToSort, sortType) => {
    const { sortEvent } = this.props;

    sortEvent(fieldToSort, sortType);
  }

  createColumn = () => {
    const { columns, sortType, fieldToSort } = this.props;
    const retval = columns.map((x) => {
      let isSortDesc = false;

      if ((x.accessor === fieldToSort) && (sortType === "desc")) {
        isSortDesc = true;
      }

      return (
        <div key={x.accessor} className="popup-data__header-column" style={{ width: x.width }} onClick={() => this.sortHandler(x.accessor, isSortDesc ? "asc" : "desc")}>{x.Header}<i className={`fa fa-caret-${isSortDesc ? "up" : "down"}`} /></div>
      );
    });

    return retval;
  }

  render() {
    return (
      <div className="popup-data__header-row">
        {this.createColumn()}
      </div>
    );
  }
}

export default ColumnHeader;
