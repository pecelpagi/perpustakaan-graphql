/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import InputText from "~/components/InputText";
import { getDecodedToken, catchError } from "../utils";
import * as graphqlApi from "../data";

class UpdatePassword extends React.Component {
    static propTypes = {
      assignBreadcrumbs: PropTypes.func,
      assignButtons: PropTypes.func,
      addNotification: PropTypes.func,
    }

    static defaultProps = {
      assignBreadcrumbs: () => { },
      assignButtons: () => { },
      addNotification: () => { },
    }

    initialButtonActions = [
      {
        id: "1",
        type: "primary",
        content: (
                <span>
                    Simpan
                </span>
        ),
        action: () => this.saveDataHandler(),
        isDisabled: false,
      },
    ];

    constructor(props) {
      super(props);

      this.state = {
        isFormSubmitted: false,
        form: {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        },
        footerButtons: this.initialButtonActions,
      };
    }

    componentDidMount = () => {
      const {
        assignButtons, assignBreadcrumbs,
      } = this.props;

      assignButtons([]);

      assignBreadcrumbs([
        {
          label: "App", link: "#",
        },
        "Ubah Password",
      ]);
    }

    doShowingNotification = (val) => {
      const { addNotification } = this.props;
      addNotification(val);
    }

    saveDataHandler = async () => {
      const {
        form,
      } = this.state;
      let notifValue = null;

      this.updateButtonsState(true);

      try {
        const isFormValid = await this.form.validateForm();

        if (isFormValid) {
          const payload = {
            username: getDecodedToken().username,
            old_password: form.oldPassword,
            new_password: form.newPassword,
            confirm_new_password: form.confirmNewPassword,
          };
          await graphqlApi.updatePassword(payload);
          notifValue = {
            title: "Berhasil",
            message: "Perubahan password tersimpan",
            level: "success",
          };
        }
      } catch (e) {
        notifValue = {
          title: "Gagal Mengubah Password",
          message: catchError(e),
          level: "error",
        };
      }

      if (notifValue) {
        this.doShowingNotification(notifValue);
        this.updateButtonsState(false);
      }

      this.setState({
        isFormSubmitted: true,
      });
    }

    changeValueHandler = async (type, val, e) => {
      const { form } = this.state;

      const { isFormSubmitted } = this.state;

      if (isFormSubmitted && e) {
        await this.onInputChangeValidate(e);
      }

      const newValue = update(form, {
        [type]: { $set: val },
      });

      this.setState({ form: newValue });
    }

    updateButtonsState = (isBtnSaveDisabled = false) => {
      const footerButtons = update(this.initialButtonActions, {
        0: { isDisabled: { $set: isBtnSaveDisabled } },
      });

      this.setState({ footerButtons });
    }


    onInputChangeValidate = ({ target }) => {
      this.form.validateInput(target);

      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout);
      }

      this.inputTimeout = setTimeout(() => {
        if (this.form.simpleValidateForm()) {
          this.updateButtonsState();
        } else {
          this.updateButtonsState(false, true);
        }
      }, 300);
    }

    formComponent = () => {
      const {
        form,
      } = this.state;
      return (
          <FormValidation ref={(c) => { this.form = c; }}>
            <div className="row mb-sm">
              <div className="col-sm-12">
                <InputText
                    label="Password Lama"
                    changeEvent={(val, e) => this.changeValueHandler("oldPassword", val, e)}
                    value={String(form.oldPassword)}
                    name="oldPassword"
                    required
                />
                <FieldFeedbacks for="oldPassword">
                    <FieldFeedback when="valueMissing">Password lama wajib diisi</FieldFeedback>
                </FieldFeedbacks>
              </div>
            </div>
            <div className="row mb-sm">
              <div className="col-sm-12">
                <InputText
                    label="Password Baru"
                    changeEvent={(val, e) => this.changeValueHandler("newPassword", val, e)}
                    value={String(form.newPassword)}
                    name="newPassword"
                    required
                />
                <FieldFeedbacks for="newPassword">
                    <FieldFeedback when="valueMissing">Password baru wajib diisi</FieldFeedback>
                </FieldFeedbacks>
              </div>
            </div>
            <div className="row mb-sm">
              <div className="col-sm-12">
                <InputText
                    label="Konfirmasi Password Baru"
                    changeEvent={(val, e) => this.changeValueHandler("confirmNewPassword", val, e)}
                    value={String(form.confirmNewPassword)}
                    name="confirmNewPassword"
                    required
                />
                <FieldFeedbacks for="confirmNewPassword">
                    <React.Fragment>
                        <FieldFeedback when="valueMissing">Konfirmasi password baru wajib diisi</FieldFeedback>
                        <FieldFeedback when={val => (String(val).length > 0 && String(val) !== String(form.newPassword))}>Periksa kembali konfirmasi baru anda</FieldFeedback>
                    </React.Fragment>
                </FieldFeedbacks>
              </div>
            </div>
          </FormValidation>
      );
    }

    render() {
      const { footerButtons } = this.state;

      return (
      <div style={{ width: "60%", position: "relative", margin: "0px auto" }}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row mb-reset">
              <div className="col-sm-12">
                <h3 className="panel-title">Ubah Password</h3>
              </div>
            </div>
          </div>
          <div className="panel-body">
            {this.formComponent()}
            <div className="row">
              <div className="col-sm-8" />
              <div className="col-sm-4 text-right">
                {footerButtons.map((x, i) => (<button key={x.id} style={(i === footerButtons.length - 1) ? {} : { marginRight: "10px" }} type="button" className={`btn ${x.type ? `btn-${x.type}` : ""}`} onClick={!x.isDisabled ? x.action : () => { }} disabled={x.isDisabled}>{x.content}</button>))}
              </div>
            </div>
        </div>
        </div>
      </div>
      );
    }
}

export default UpdatePassword;
