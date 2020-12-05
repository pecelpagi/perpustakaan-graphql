import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import InputText from "~/components/InputText";
import * as graphqlApi from "../../data";

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

  setupData = async () => {
    const { match: { params } } = this.props;

    if (params.type === "edit") {
      await this.setupDetailData(params.id);
    } else {
      this.setupBreadcrumbs("Tambah Data");
    }
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
    const res = await graphqlApi.getCategory(id);

    const { category: data } = res;
    const newState = {
      id: data.id,
      type: "edit",
      form: {
        code: data.code,
        name: data.name,
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
      form,
    } = this.state;
    return (
      <FormValidation ref={(c) => { this.form = c; }}>
        <div className="row mb-sm">
          <div className="col-sm-6">
            <InputText
              label="Kode Kategori"
              changeEvent={(val, e) => this.changeValueHandler("code", val, e)}
              value={String(form.code)}
              name="code"
              required
            />
            <FieldFeedbacks for="code">
              <FieldFeedback when="valueMissing">Kode wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-6">
            <InputText
              label="Nama Kategori"
              changeEvent={(val, e) => this.changeValueHandler("name", val, e)}
              value={String(form.name)}
              name="name"
              required
            />
            <FieldFeedbacks for="name">
              <FieldFeedback when="valueMissing">Nama kategori wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
      </FormValidation>
    );
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/categories");
  }

  saveDataHandler = async () => {
    const {
      form, type, id,
    } = this.state;
    this.updateButtonsState(true, true);

    const isFormValid = await this.form.validateForm();

    if (isFormValid) {
      if (type === "create") {
        await graphqlApi.createCategory(form);
      } else {
        const payload = {
          id,
          ...form,
        };
        await graphqlApi.updateCategory(payload);
      }
      this.gotoBasePath();
      return;
    }

    this.updateButtonsState(false, true);

    this.setState({
      isFormSubmitted: true,
    });
  }

  onDelete = async () => {
    const {
      id,
    } = this.state;

    await graphqlApi.deleteCategory(id);
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
                <h3 className="panel-title">{type === "create" ? "Tambah" : "Edit"} Kategori</h3>
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
