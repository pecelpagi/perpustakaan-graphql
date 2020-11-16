/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import RadioPopup from "./RadioPopup";

class BrowseData extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    onFetch: PropTypes.func,
    placeholder: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    })),
    columns: PropTypes.arrayOf(PropTypes.shape({
      accessor: PropTypes.string,
      Header: PropTypes.string,
      width: PropTypes.string,
    })).isRequired,
    value: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      name: PropTypes.string,
    }),
  }

  static defaultProps = {
    label: "",
    placeholder: "",
    onFetch: undefined,
    data: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
    };
  }

  showPopupHandler = () => {
    this.setState({ showPopup: true });
  }

  hidePopupHandler = () => {
    this.setState({ showPopup: false });
  }

  saveHandler = (val) => {
    const { changeEvent } = this.props;
    this.setState({ showPopup: false });
    changeEvent(val);
  }

  render() {
    const {
      label, onFetch, placeholder, columns, value, data,
    } = this.props;
    const { showPopup } = this.state;

    return (
      <div className="form-group mb-reset">
        {label && <label>{label}</label>}
        <div className="input-group">
          <input type="text" className="form-control" value={value.name} onChange={() => {}} placeholder={`- ${placeholder} -`} readOnly />
          <span className="input-group-btn">
            <button type="button" className="btn btn-default btn-flat" onClick={this.showPopupHandler}><i className="fa fa-ellipsis-h" /></button>
          </span>
        </div>
        { showPopup && (
          <RadioPopup
            width={400}
            hideModal={this.hidePopupHandler}
            saveHandler={this.hidePopupHandler}
            title={placeholder}
            columns={columns}
            onFetch={onFetch}
            saveHandler={this.saveHandler}
            value={value}
            data={data}
          />
        )}
      </div>
    );
  }
}

export default BrowseData;
