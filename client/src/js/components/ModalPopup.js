/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";

class ModalPopup extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    hideModal: PropTypes.func,
    saveHandler: PropTypes.func,
    title: PropTypes.string,
  }

  static defaultProps = {
    hideModal: () => { },
    width: 320,
    saveHandler: undefined,
    title: "",
  }

  constructor(props) {
    super(props);

    this.state = {
      btnDisabled: false,
      btnText: "",
    };
  }

  applyValue = () => {
    const { btnDisabled } = this.state;

    if (!btnDisabled) {
      const { saveHandler } = this.props;
      this.setState({
        btnDisabled: true,
        btnText: "Tunggu ...",
      });

      saveHandler(this.buttonCallback);
    }
  }

  hideModalHandler = () => {
    const { btnDisabled } = this.state;
    const { hideModal } = this.props;

    if (!btnDisabled) {
      hideModal();
    }
  }

  buttonCallback = () => {
    this.setState({
      btnDisabled: false,
      btnText: "",
    });
  }

  render() {
    const {
      children,
      width,
      title,
      saveHandler,
    } = this.props;
    const {
      btnDisabled,
      btnText,
    } = this.state;

    return (
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog" style={{ width: `${width}px` }}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close disabled" onClick={this.hideModalHandler} aria-label="Close">
                <span aria-hidden="true">×</span></button>
              <h4 className="modal-title text-left">{title}</h4>
            </div>
            <div className="modal-body text-center">
              {children}
            </div>
            {saveHandler && (
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn btn-default ${btnDisabled ? "disabled" : ""} pull-left`}
                  onClick={this.hideModalHandler}>Batal</button>
                <button
                  type="button"
                  className={`btn btn-primary ${btnDisabled ? "disabled" : ""}`}
                  onClick={this.applyValue}>{btnText || "Simpan"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ModalPopup;
