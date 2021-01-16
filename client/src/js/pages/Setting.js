/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import InputText from "~/components/InputText";
import * as graphqlApi from "../data";

class Setting extends React.Component {
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
          late_charge: 0,
          max_loan_duration: 0,
          max_loan_qty: 0,
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
        {
          label: "Peminjaman", link: "#",
        },
        "Pengaturan",
      ]);

      this.fetchSetting();
    }

    fetchSetting = async () => {
      const res = await graphqlApi.getSetting();
      const { setting: data } = res;

      this.setState({
        form: {
          late_charge: data.late_charge,
          max_loan_duration: data.max_loan_duration,
          max_loan_qty: data.max_loan_qty,
        },
      });
    }

    saveDataHandler = async () => {
      const {
        form,
      } = this.state;
      const { addNotification } = this.props;
      this.updateButtonsState(true);

      const isFormValid = await this.form.validateForm();

      if (isFormValid) {
        await graphqlApi.updateSetting(form);
        addNotification({
          title: "Berhasil",
          message: "Perubahan pengaturan tersimpan",
          level: "success",
        });
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
        [type]: { $set: val ? parseFloat(val) : "" },
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
                    label="Nominal Denda"
                    changeEvent={(val, e) => this.changeValueHandler("late_charge", val, e)}
                    value={String(form.late_charge)}
                    name="late_charge"
                    required
                />
                <FieldFeedbacks for="late_charge">
                    <FieldFeedback when="valueMissing">Nominal denda wajib diisi</FieldFeedback>
                </FieldFeedbacks>
              </div>
            </div>
            <div className="row mb-sm">
              <div className="col-sm-12">
                <InputText
                    label="Maksimal Durasi Peminjaman"
                    changeEvent={(val, e) => this.changeValueHandler("max_loan_duration", val, e)}
                    value={String(form.max_loan_duration)}
                    name="max_loan_duration"
                    required
                />
                <FieldFeedbacks for="max_loan_duration">
                    <FieldFeedback when="valueMissing">Maksimal durasi peminjaman wajib diisi</FieldFeedback>
                </FieldFeedbacks>
              </div>
            </div>
            <div className="row mb-sm">
              <div className="col-sm-12">
                <InputText
                    label="Maksimal Peminjaman Koleksi"
                    changeEvent={(val, e) => this.changeValueHandler("max_loan_qty", val, e)}
                    value={String(form.max_loan_qty)}
                    name="max_loan_qty"
                    required
                />
                <FieldFeedbacks for="max_loan_qty">
                    <FieldFeedback when="valueMissing">Maksimal peminjaman koleksi wajib diisi</FieldFeedback>
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
                <h3 className="panel-title">Pengaturan Peminjaman</h3>
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

export default Setting;
