/* eslint prop-types: 0 */
import React from "react";
import update from "immutability-helper";
import NotificationSystem from "react-notification-system";
import InputText from "../../components/InputText";
import * as graphqlApi from "../../data";
import { catchError } from "../../utils";

import "./styles.scss";

class AddVisit extends React.Component {
  initialButtonActions = [
    {
      id: "1",
      type: "primary btn-block",
      content: (
        <span>
          Masuk
        </span>
      ),
      action: () => this.handleSubmitAttendance(),
      isDisabled: false,
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      nomorInduk: "",
      buttons: this.initialButtonActions,
    };
  }

  showNotification = (val) => {
    this.notificationSystem.addNotification(val);
  };

  updateButtonsState = (isBtnDisabled = false) => {
    const buttons = update(this.initialButtonActions, {
      0: { isDisabled: { $set: isBtnDisabled } },
    });

    this.setState({ buttons });
  }

  handleChangeNomorInduk = (val) => {
    this.setState({ nomorInduk: val });
  }

  handleSubmitAttendance = async (e) => {
    if (e) e.preventDefault();

    let notifValue = null;
    const { nomorInduk } = this.state;

    this.updateButtonsState(true);

    try {
      await graphqlApi.addAttendance(nomorInduk);
      notifValue = {
        title: "Berhasil",
        message: "Data telah tersimpan",
        level: "success",
      };
    } catch (err) {
      notifValue = {
        title: "Gagal",
        message: catchError(err),
        level: "error",
        autoDismiss: 7,
      };
    }

    this.updateButtonsState(false);

    if (notifValue) {
      this.showNotification(notifValue);
    }
  }

  renderFormInput = () => {
    const { nomorInduk, buttons } = this.state;

    return (
        <form onSubmit={this.handleSubmitAttendance}>
          <div className="add-visit-container__form">
            <div className="text-center">
                <h4>Selamat berkunjung di Perpustakaan SMAN 1 Batu</h4>
                <h4>Mohon masukkan nomor induk anda</h4>
            </div>
            <hr />
            <div className="mb-sm">
                <InputText
                    label="No Induk:"
                    value={nomorInduk}
                    placeholder="NIP/NIS"
                    changeEvent={this.handleChangeNomorInduk}
                />
            </div>
            <div>
                {buttons.map(x => (<button key={x.id} type="button" className={`btn ${x.type ? `btn-${x.type}` : ""}`} onClick={!x.isDisabled ? x.action : () => { }} disabled={x.isDisabled}>{x.content}</button>))}
            </div>
          </div>
        </form>
    );
  }

  render() {
    return (
      <div className="add-visit-container">
        {this.renderFormInput()}
        <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
      </div>
    );
  }
}

export default AddVisit;
