import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import InputText from "~/components/InputText";
import * as graphqlApi from "../../data";
import { catchError } from "../../utils";

class MemberDetail extends React.Component {
  static propTypes = {
    assignButtons: PropTypes.func.isRequired,
    showNotification: PropTypes.func,
  }

  static defaultProps = {
    assignButtons: () => { },
    showNotification: () => { },
  }

  initialButtonActions = [
    {
      id: "1",
      type: null,
      content: (
        <span>
          Batal
        </span>
      ),
      action: () => this.gotoBasePath(),
      isDisabled: false,
    },
    {
      id: "2",
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
      id: "",
      isFormSubmitted: false,
      type: "create",
      form: {
        registration_number: "",
        name: "",
        address: "",
        email: "",
        phone: "",
      },
      footerButtons: this.initialButtonActions,
    };
  }

  componentWillMount = () => {
    this.setupData();
  }

  doShowingNotification = (message) => {
    const { addNotification } = this.props;
    addNotification(message);
  }

  setLoading = (isLoading) => {
    const { startLoading, endLoading } = this.props;

    if (isLoading) startLoading();
    if (!isLoading) endLoading();
  }

  setupRegistrationNumber = async () => {
    const { form } = this.state;
    const registrationNumber = await graphqlApi.getRegistrationNumber();

    const newValue = update(form, {
      registration_number: { $set: registrationNumber },
    });

    this.setState({ form: newValue });
  }

  setupData = async () => {
    const { match: { params } } = this.props;

    this.setLoading(true);

    if (params.type === "edit") {
      await this.setupDetailData(params.id);
    } else {
      this.setupBreadcrumbs("Tambah Data");
      await this.setupRegistrationNumber();
    }

    this.setLoading(false);
  }

  setupBreadcrumbs = (text) => {
    const { assignButtons, assignBreadcrumbs } = this.props;

    assignButtons([]);
    assignBreadcrumbs([
      {
        label: "App", link: "#",
      },
      {
        label: "Keanggotaan", link: "#",
      },
      {
        label: "Kelola Anggota", link: "/members",
      },
      text,
    ]);
  }

  setupDetailData = async (id) => {
    const res = await graphqlApi.getMember(id);

    const { member: data } = res;
    const newState = {
      id: data.id,
      type: "edit",
      form: {
        registration_number: data.registration_number,
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
      },
    };

    this.setupBreadcrumbs(data.name);
    this.setState(newState);
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

  updateButtonsState = (isBtnCancelDisabled = false, isBtnSaveDisabled = false) => {
    const footerButtons = update(this.initialButtonActions, {
      0: { isDisabled: { $set: isBtnCancelDisabled } },
      1: { isDisabled: { $set: isBtnSaveDisabled } },
    });

    this.setState({ footerButtons });
  }

  formComponent = () => {
    const {
      form, type,
    } = this.state;
    return (
      <FormValidation ref={(c) => { this.form = c; }}>
        <div className="row mb-sm">
          <div className="col-sm-6">
            <InputText
              label="No Induk"
              changeEvent={() => {}}
              value={String(form.registration_number)}
              name="registration_number"
              disabled
              required
            />
            <FieldFeedbacks for="registration_number">
              <FieldFeedback when="valueMissing">No Induk wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-6">
            <InputText
              label="Nama"
              changeEvent={(val, e) => this.changeValueHandler("name", val, e)}
              value={String(form.name)}
              name="name"
              required
            />
            <FieldFeedbacks for="name">
              <FieldFeedback when="valueMissing">Nama wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-12">
            <InputText
              label="Alamat"
              changeEvent={(val, e) => this.changeValueHandler("address", val, e)}
              value={String(form.address)}
              name="address"
              required
            />
            <FieldFeedbacks for="address">
              <FieldFeedback when="valueMissing">Alamat wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-6">
            <InputText
              label="Email"
              changeEvent={(val, e) => this.changeValueHandler("email", val, e)}
              value={String(form.email)}
              name="email"
              required
            />
            <FieldFeedbacks for="email">
              <FieldFeedback when="valueMissing">Email wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-6">
            <InputText
              label="No Telepon"
              changeEvent={(val, e) => this.changeValueHandler("phone", val, e)}
              value={String(form.phone)}
              name="phone"
              required
            />
            <FieldFeedbacks for="phone">
              <FieldFeedback when="valueMissing">No Telepon wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
      </FormValidation>
    );
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/members");
  }

  saveDataHandler = async () => {
    try {
      const {
        form, type, id,
      } = this.state;

      this.setState({
        isFormSubmitted: true,
      });

      this.updateButtonsState(true, true);

      const isFormValid = await this.form.validateForm();

      if (isFormValid) {
        this.setLoading(true);

        if (type === "create") {
          await graphqlApi.createMember(form);
        } else {
          const payload = {
            id,
            ...form,
          };
          await graphqlApi.updateMember(payload);
        }

        this.setLoading(false);

        this.gotoBasePath();
        return;
      }

      this.updateButtonsState(false, true);
    } catch (err) {
      this.setLoading(false);
      this.updateButtonsState(false, false);
      this.doShowingNotification({
        title: "Terjadi Kesalahan",
        message: catchError(err),
        level: "error",
      });
    }
  }

  onDelete = async () => {
    const {
      id,
    } = this.state;

    this.setLoading(true);
    await graphqlApi.deleteMember(id);
    this.setLoading(false);

    this.gotoBasePath();
  }

  render = () => {
    const {
      footerButtons, type,
    } = this.state;

    return (
      <div style={{ width: "80%", position: "relative", margin: "0px auto" }}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row mb-reset">
              <div className="col-sm-12">
                <h3 className="panel-title">{type === "create" ? "Tambah" : "Edit"} Anggota</h3>
              </div>
            </div>
          </div>
          <div className="panel-body">
            {this.formComponent()}
            <div className="row">
              <div className="col-sm-8">
                {type === "edit" ? <button type="button" className="btn" onClick={this.onDelete}><i className="fa fa-trash-o" /></button> : null}
              </div>
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

export default MemberDetail;
