/* eslint prop-types: 0 */
import React from "react";
import update from "immutability-helper";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import InputText from "~/components/InputText";
import ImageUpload from "~/components/ImageUpload";
import FormValidation from "~/components/FormValidation";
import BrowseData from "~/components/BrowseData";
import * as graphqlApi from "../../data";
import createCode from "./helper";

const categoryColumns = [
  {
    accessor: "name",
    Header: "Kategori",
    width: "100%",
  },
];
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
      footerButtons: this.initialButtonActions,
      form: {
        isbn: "",
        code: "",
        category: {
          id: "",
          name: "",
        },
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
        label: "Koleksi Pustaka", link: "#",
      },
      {
        label: "Daftar Buku", link: "/books",
      },
      text,
    ]);
  }

  setupDetailData = async (id) => {
    const res = await graphqlApi.getBook(id);

    const { book: data } = res;
    const newState = {
      id: data.id,
      type: "edit",
      form: {
        code: data.code,
        isbn: data.isbn,
        category: {
          id: data.category.id,
          name: data.category.name,
        },
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        city: data.city,
        year: data.year,
        cover: data.cover,
        qty: data.qty,
      },
    };

    this.setupBreadcrumbs(data.title);
    this.setState(newState);
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/books");
  }

  saveDataHandler = async () => {
    const {
      form, type, id,
    } = this.state;
    this.updateButtonsState(true, true);

    const isFormValid = await this.form.validateForm();

    if (isFormValid) {
      let payload = {
        ...form,
        category_id: form.category.id,
        code: createCode(form),
        isbn: String(form.isbn),
        year: parseInt(form.year, 10),
        qty: parseInt(form.qty, 10),
      };
      delete payload.category;

      if (type === "create") {
        await graphqlApi.createBook(payload);
      } else {
        payload = {
          id,
          ...payload,
          code: form.code,
        };
        await graphqlApi.updateBook(payload);
      }
      this.gotoBasePath();
      return;
    }

    this.updateButtonsState(false, true);

    this.setState({
      isFormSubmitted: true,
    });
  }

  changeCategoryHandler = (val) => {
    const { form } = this.state;
    const newValue = update(form, {
      category: { $set: { id: val.id, name: val.name } },
    });

    this.setState({ form: newValue }, () => {
      this.validateCategory();
    });
  }

  validateCategory = async () => {
    const { isFormSubmitted } = this.state;

    if (isFormSubmitted) {
      await this.onInputChangeValidate({ target: this.categoryHidden });
    }
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

  onFetchCategory = async (state) => {
    const payload = {
      limit: 10,
      skip: 10 * (parseInt(state.page, 10) - 1),
    };
    const res = await graphqlApi.getCategories(payload);
    const data = res.categories.map(x => ({ id: x.id, name: `${x.code}: ${x.name}` }));

    return {
      data,
      payload: { total_page: res.meta_data.total_page },
    };
  }

  formComponent = () => {
    const {
      form,
    } = this.state;
    return (
      <FormValidation ref={(c) => { this.form = c; }}>
        <div className="row mb-sm">
          <div className="col-sm-4">
            <InputText
              label="Nomor Panggil"
              value={form.code}
              disabled
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
            <div className="form-group position-relative mb-reset">
              <BrowseData
                label="Kategori"
                placeholder="Pilih Kategori"
                columns={categoryColumns}
                value={form.category}
                changeEvent={this.changeCategoryHandler}
                onFetch={this.onFetchCategory}
              />
              <input
                ref={(c) => { this.categoryHidden = c; }}
                className="hide-for-validation"
                name="categoryHidden"
                type="text"
                value={form.category.id}
                onChange={() => { }}
                required
              />
            </div>
            <FieldFeedbacks for="categoryHidden">
              <FieldFeedback when="valueMissing">Kategori wajib diisi</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-4">
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
          <div className="col-sm-4">
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
          <div className="col-sm-4">
            <InputText
              label="Jumlah Koleksi"
              changeEvent={(val, e) => this.changeValueHandler("qty", val, e)}
              value={String(form.qty)}
              name="qty"
              required
            />
            <FieldFeedbacks for="qty">
              <FieldFeedback when="valueMissing">Jumlah Koleksi wajib diisi</FieldFeedback>
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
      </FormValidation>
    );
  }

  render() {
    const { type, footerButtons, form } = this.state;

    return (
      <div style={{ width: "100%", position: "relative", margin: "0px auto" }}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row mb-reset">
              <div className="col-sm-12">
                <h3 className="panel-title">{type === "create" ? "Tambah" : "Edit"} Buku</h3>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <div className="row mb-sm">
              <div className="col-sm-9">
                {this.formComponent()}
              </div>
              <div className="col-sm-3 text-center">
                <ImageUpload
                  value={form.cover}
                  changeEvent={(val) => { this.changeValueHandler("cover", val); }}
                />
              </div>
            </div>
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
