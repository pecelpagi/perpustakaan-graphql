/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import { List, CellMeasurerCache, CellMeasurer } from "react-virtualized";

class ColumnBody extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    })),
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      accessor: PropTypes.string,
      Header: PropTypes.string,
      width: PropTypes.string,
    })).isRequired,
    onFetch: PropTypes.func,
  }

  cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 70,
    keyMapper: (rowIndex, columnIndex) => {
      const { data } = this.props;
      const row = data[rowIndex];
      return `${row.id}:${columnIndex}`;
    },
    onFetch: () => {},
  })

  constructor(props) {
    super(props);

    this.state = {
      scrollIndex: undefined,
    };
  }

  createColumnContent = (columns, rowData) => {
    const retval = columns.map(x => (
      <div key={x.accessor} className="popup-data__row-content-column" style={{ width: x.width }}>
        {rowData[x.accessor]}
      </div>
    ));

    return retval;
  }

  clickHandler = (val) => {
    const { clickEvent } = this.props;
    clickEvent(val);
  }

  renderRow = (paramData) => {
    const { index, style, parent } = paramData;
    const { data, columns, value } = this.props;

    return (
      <CellMeasurer
        key={data[index].id}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div className="popup-data__row-content" style={style} onClick={() => this.clickHandler(data[index])}>
          {this.createColumnContent(columns, data[index])}
          <div className="radio-wrapper">
            <div key={data[index].id} className="radio-container" onClick={() => this.clickHandler(data[index])}>
              <input
                type="radio"
                checked={String(data[index].id) === String(value.id)}
                onChange={() => { }}
                value={data[index].id}
              />
              <span className="checkmark"></span>
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  }

  refreshScrollPosition = () => {
    this.setState({
      scrollIndex: 0,
    });
  }

  onScrollHandler = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (scrollTop === (scrollHeight - clientHeight)) {
      const { onFetch } = this.props;
      onFetch();
    }
  }

  render() {
    const {
      data, width, height,
    } = this.props;
    const { scrollIndex } = this.state;

    return (
      <div className="popup-data__body">
        <List
          ref={(c) => { this.checkList = c; }}
          width={width}
          height={height}
          rowCount={data.length}
          rowRenderer={this.renderRow}
          deferredMeasurementCache={this.cache}
          rowHeight={this.cache.rowHeight}
          scrollToIndex={scrollIndex}
          onScroll={this.onScrollHandler}
          onRowsRendered={() => this.setState({ scrollIndex: undefined })}
        />
      </div>
    );
  }
}

export default ColumnBody;
