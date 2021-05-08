/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";

class InputText extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    changeEvent: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    type: PropTypes.string,
    numberOnly: PropTypes.bool,
  }

  static defaultProps = {
    label: undefined,
    value: "",
    name: undefined,
    placeholder: "",
    changeEvent: () => {},
    disabled: false,
    required: false,
    type: "text",
    numberOnly: false,
  }

  changeHandler = (e) => {
    const { changeEvent, numberOnly } = this.props;

    const val = e.target.value;

    const isNumber = /^\d*$/.test(val);
    if (!isNumber && numberOnly) return;

    changeEvent(val, e);
  }

  render() {
    const {
      label, value, placeholder, disabled,
      required, name, type,
    } = this.props;

    return (
      <div className={"form-group mb-reset"}>
        {label && <label>{label}</label>}
        <input
          type={type}
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={this.changeHandler}
          disabled={disabled}
          required={required}
          autoComplete="off"
        />
      </div>
    );
  }
}

export default InputText;
