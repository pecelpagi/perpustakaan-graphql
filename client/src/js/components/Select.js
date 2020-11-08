/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";

class Select extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    data: PropTypes.arrayOf(PropTypes.shape({})),
    changeEvent: PropTypes.func,
    required: PropTypes.bool,
  }

  static defaultProps = {
    label: undefined,
    value: "",
    name: undefined,
    data: [],
    changeEvent: () => {},
    required: false,
  }

  changeHandler = (e) => {
    const { changeEvent } = this.props;

    changeEvent(e.target.value, e);
  }

  render() {
    const {
      label, value, data,
      required, name,
    } = this.props;

    return (
      <div className="form-group style-select mb-reset">
        {label && <label>{label}</label>}
        <select name={name} value={value} className="form-control" onChange={this.changeHandler} required={required}>
            { data.map(x => (<option key={x.id} value={x.id}>{x.name}</option>)) }
        </select>
      </div>
    );
  }
}

export default Select;
