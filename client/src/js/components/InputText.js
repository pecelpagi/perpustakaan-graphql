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
  }

  static defaultProps = {
    label: undefined,
    value: "",
    name: undefined,
    placeholder: "",
    changeEvent: () => {},
    disabled: false,
    required: false,
  }

  changeHandler = (e) => {
    const { changeEvent } = this.props;

    changeEvent(e.target.value, e);
  }

  render() {
    const {
      label, value, placeholder, disabled,
      required, name,
    } = this.props;

    return (
      <div className={"form-group mb-reset"}>
        {label && <label>{label}</label>}
        <input
          type="text"
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
