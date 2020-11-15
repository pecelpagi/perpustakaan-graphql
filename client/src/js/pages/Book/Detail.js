/* eslint prop-types: 0 */
import React from "react";
import update from "immutability-helper";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import InputText from "~/components/InputText";
import Select from "~/components/Select";
import ImageUpload from "~/components/ImageUpload";
import FormValidation from "~/components/FormValidation";

class BookDetail extends React.Component {
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
      categoryList: [],
      footerButtons: this.initialButtonActions,
      form: {
        bookCallNumber: "",
        isbn: "",
        idCategory: "",
        title: "",
        author: "",
        publisher: "",
        city: "",
        year: "",
        cover: "",
        qty: "",
      },
    };
  }

  componentDidMount = () => {
    const { match: { params } } = this.props;

    if (params.type === "edit") {
      this.setState({ title: `Edit Book Detail: ${params.id}` });
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
        label: "Koleksi Pustaka", link: "#",
      },
      {
        label: "Daftar Buku", link: "/books",
      },
      text,
    ]);
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/books");
  }

  saveDataHandler = () => {

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

  onDelete = () => {

  }

  formComponent = () => {
    const {
      form, categoryList,
    } = this.state;
    return (
      <FormValidation ref={(c) => { this.form = c; }}>
        <div className="row mb-sm">
          <div className="col-sm-4">
            <InputText
              label="Nomor Panggil"
              value={String(form.bookCallNumber)}
            />
          </div>
          <div className="col-sm-4">
            <InputText
              label="ISBN"
              changeEvent={(val, e) => this.changeValueHandler("isbn", val, e)}
              value={String(form.isbn)}
              name="isbn"
              required
            />
            <FieldFeedbacks for="isbn">
              <FieldFeedback when="valueMissing">ISBN wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-4">
            <Select
              label="Kode Klasifikasi"
              data={categoryList}
              value={form.idCategory}
              changeEvent={(val, e) => this.changeValueHandler("idCategory", val, e)}
              name="idCategory"
              required
            />
            <FieldFeedbacks for="idCategory">
              <FieldFeedback when="valueMissing">Kode Klasifikasi wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-6">
            <InputText
              label="Judul"
              changeEvent={(val, e) => this.changeValueHandler("title", val, e)}
              value={String(form.title)}
              name="title"
              required
            />
            <FieldFeedbacks for="title">
              <FieldFeedback when="valueMissing">Judul wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-6">
            <InputText
              label="Nama Pengarang"
              changeEvent={(val, e) => this.changeValueHandler("author", val, e)}
              value={String(form.author)}
              name="author"
              required
            />
            <FieldFeedbacks for="author">
              <FieldFeedback when="valueMissing">Nama pengarang wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-4">
            <InputText
              label="Penerbit"
              changeEvent={(val, e) => this.changeValueHandler("publisher", val, e)}
              value={String(form.publisher)}
              name="publisher"
              required
            />
            <FieldFeedbacks for="publisher">
              <FieldFeedback when="valueMissing">Penerbit wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-4">
            <InputText
              label="Kota Terbit"
              changeEvent={(val, e) => this.changeValueHandler("city", val, e)}
              value={String(form.city)}
              name="city"
              required
            />
            <FieldFeedbacks for="city">
              <FieldFeedback when="valueMissing">Kota terbit wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-4">
            <InputText
              label="Tahun Terbit"
              changeEvent={(val, e) => this.changeValueHandler("year", val, e)}
              value={String(form.year)}
              name="year"
              required
            />
            <FieldFeedbacks for="year">
              <FieldFeedback when="valueMissing">Tahun terbit wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-6">
            <ImageUpload
              value={form.cover}
              changeEvent={(val) => { this.changeValueHandler("cover", val); }}
            />
          </div>
        </div>
      </FormValidation>
    );
  }

  render() {
    const { type, footerButtons } = this.state;

    return (
      <div style={{ width: "80%", position: "relative", margin: "0px auto" }}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row mb-0">
              <div className="col-sm-12">
                <h3 className="panel-title">{type === "create" ? "Tambah" : "Edit"} Buku</h3>
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

export default BookDetail;
