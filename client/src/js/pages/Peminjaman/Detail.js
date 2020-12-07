import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import moment from "moment";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import InputText from "~/components/InputText";
import BrowseData from "~/components/BrowseData";
import DatePicker from "~/components/DatePicker";
import * as graphqlApi from "../../data";

const bookColumns = [
  {
    accessor: "name",
    Header: "Judul Buku",
    width: "100%",
  },
];
const memberColumns = [
  {
    accessor: "name",
    Header: "Nama Anggota",
    width: "100%",
  },
];
class PeminjamanDetail extends React.Component {
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
        book: {
          id: "",
          name: "",
        },
        member: {
          id: "",
          name: "",
        },
        borrow_date: moment().format("YYYY-MM-DD"),
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
      this.setupBreadcrumbs("Peminjaman Baru");
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
        label: "Peminjaman", link: "#",
      },
      text,
    ]);
  }

  setupDetailData = async (id) => {
    // logic here
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

  changeBookHandler = (val) => {
    const { form } = this.state;
    const newValue = update(form, {
      book: { $set: { id: val.id, name: val.name } },
    });

    this.setState({ form: newValue }, () => {
      this.validateBook();
    });
  }

  validateBook = async () => {
    const { isFormSubmitted } = this.state;

    if (isFormSubmitted) {
      await this.onInputChangeValidate({ target: this.bookHidden });
    }
  }

  changeMemberHandler = (val) => {
    const { form } = this.state;
    const newValue = update(form, {
      member: { $set: { id: val.id, name: val.name } },
    });

    this.setState({ form: newValue }, () => {
      this.validateMember();
    });
  }

  validateMember = async () => {
    const { isFormSubmitted } = this.state;

    if (isFormSubmitted) {
      await this.onInputChangeValidate({ target: this.memberHidden });
    }
  }

  onFetchBook = async (state) => {
    const payload = {
      limit: 10,
      skip: 10 * (parseInt(state.page, 10) - 1),
    };
    const res = await graphqlApi.getBooks(payload);
    const data = res.books.map(x => ({ id: x.id, name: `${x.code}: ${x.title}` }));

    return {
      data,
      payload: { total_page: res.meta_data.total_page },
    };
  }

  onFetchMember = async (state) => {
    const payload = {
      limit: 10,
      skip: 10 * (parseInt(state.page, 10) - 1),
    };
    const res = await graphqlApi.getMembers(payload);
    const data = res.members.map(x => ({ id: x.id, name: `${x.registration_number}: ${x.name}` }));

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
          <div className="col-sm-12">
            <div className="form-group position-relative mb-reset">
              <BrowseData
                label="Buku"
                placeholder="Pilih Buku"
                columns={bookColumns}
                value={form.book}
                changeEvent={this.changeBookHandler}
                onFetch={this.onFetchBook}
              />
              <input
                ref={(c) => { this.bookHidden = c; }}
                className="hide-for-validation"
                name="bookHidden"
                type="text"
                value={form.book.id}
                onChange={() => { }}
                required
              />
            </div>
            <FieldFeedbacks for="bookHidden">
              <FieldFeedback when="valueMissing">Buku wajib dipilih</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
        <div className="row mb-sm">
          <div className="col-sm-9">
            <div className="form-group position-relative mb-reset">
              <BrowseData
                label="Peminjam"
                placeholder="Pilih Peminjam"
                columns={memberColumns}
                value={form.member}
                changeEvent={this.changeMemberHandler}
                onFetch={this.onFetchMember}
              />
              <input
                ref={(c) => { this.memberHidden = c; }}
                className="hide-for-validation"
                name="memberHidden"
                type="text"
                value={form.member.id}
                onChange={() => { }}
                required
              />
            </div>
            <FieldFeedbacks for="memberHidden">
              <FieldFeedback when="valueMissing">Anggota wajib dipilih</FieldFeedback>
            </FieldFeedbacks>
          </div>
          <div className="col-sm-3">
            <DatePicker label="Tanggal Pinjam" value={form.borrow_date} onChange={val => this.changeValueHandler("borrow_date", val)} />
          </div>
        </div>
      </FormValidation>
    );
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/peminjaman-list");
  }

  saveDataHandler = async () => {
    const {
      form, type, id,
    } = this.state;
    this.updateButtonsState(true, true);

    const isFormValid = await this.form.validateForm();

    if (isFormValid) {
      const payload = {
        ...form,
        book_id: form.book.id,
        member_id: form.member.id,
      };
      delete payload.book;
      delete payload.member;
      if (type === "create") {
        await graphqlApi.borrowBook(payload);
      }
      this.gotoBasePath();
      return;
    }

    this.updateButtonsState(false, true);

    this.setState({
      isFormSubmitted: true,
    });
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
                <h3 className="panel-title">Peminjaman Baru</h3>
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

export default PeminjamanDetail;
