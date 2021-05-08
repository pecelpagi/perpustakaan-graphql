import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import moment from "moment";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import BrowseData from "~/components/BrowseData";
import DatePicker from "~/components/DatePicker";
import * as graphqlApi from "../../data";
import { catchError, checkIsMember } from "~/utils";

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
      type: "",
      maxLoanDuration: 0,
      detail: {
        code: "",
        book_title: "",
        member_name: "",
        borrow_date: "",
        return_date: "",
      },
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

  doShowingNotification = (val) => {
    const { addNotification } = this.props;

    addNotification(val);
  }

  setLoading = (isLoading) => {
    const { startLoading, endLoading } = this.props;

    if (isLoading) startLoading();
    if (!isLoading) endLoading();
  }

  setupData = async () => {
    const { match: { params } } = this.props;

    this.setLoading(true);

    await this.fetchSetting();

    if (params.type === "detail") {
      await this.setupDetailData(params.id);
    } else {
      this.setState({ type: "create" }, () => {
        this.setupBreadcrumbs("Peminjaman Baru");
      });
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
        label: "Peminjaman", link: "#",
      },
      text,
    ]);
  }

  setupDetailData = async (id) => {
    const res = await graphqlApi.getBorrowing(id);

    const { borrowing: data } = res;
    const newState = {
      id: data.id,
      type: "detail",
      detail: {
        code: data.code,
        book_title: `${data.book.code} (${data.book.title})`,
        member_name: `${data.member.registration_number} (${data.member.name})`,
        borrow_date: moment(data.borrow_date, "YYYY-MM-DD").format("DD MMMM YYYY"),
        return_date: data.return_date === "-" ? "-" : moment(data.return_date, "YYYY-MM-DD").format("DD MMMM YYYY"),
      },
    };

    this.setupBreadcrumbs("Data Peminjaman");
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

  fetchSetting = async () => {
    const res = await graphqlApi.getSetting();
    const { setting: data } = res;

    this.setState({
      maxLoanDuration: data.max_loan_duration,
    });
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

  detailComponent = () => {
    const { detail } = this.state;

    return (
      <table className="table">
        <tbody>
          <tr>
            <td style={{ width: "20%" }}>Kode Transaksi</td>
            <td style={{ width: "2%" }}>:</td>
            <td style={{ width: "78%" }}>{detail.code}</td>
          </tr>
          <tr>
            <td>Pustaka Dipinjam</td>
            <td>:</td>
            <td>{detail.book_title}</td>
          </tr>
          <tr>
            <td>Identitas Peminjam</td>
            <td>:</td>
            <td>{detail.member_name}</td>
          </tr>
          <tr>
            <td>Tanggal Pinjam</td>
            <td>:</td>
            <td>{detail.borrow_date}</td>
          </tr>
          <tr>
            <td>Tanggal Kembali</td>
            <td>:</td>
            <td>{detail.return_date === "-" ? "Belum Dikembalikan" : detail.return_date}</td>
          </tr>
          <tr>
            <td>
              <button type="button" className="btn" onClick={this.gotoBasePath}>Kembali ke Status Peminjaman</button>
            </td>
            <td></td>
            <td>
              {detail.return_date === "-" && !checkIsMember() && <button type="button" className="btn" onClick={this.onReturnBook}>Selesai Pinjam</button>}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  createMaxLoanDate = () => {
    const { form, maxLoanDuration } = this.state;
    const days = parseInt(maxLoanDuration, 10);
    return moment(form.borrow_date, "YYYY-MM-DD").add(days, days > 1 ? "days" : "day").format("YYYY-MM-DD");
  }

  formComponent = () => {
    const {
      form,
    } = this.state;
    return (
      <FormValidation ref={(c) => { this.form = c; }}>
        <div className="row mb-sm">
          <div className="col-sm-6">
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
          <div className="col-sm-3">
            <DatePicker label="Maksimal Pengembalian" value={this.createMaxLoanDate()} onChange={() => {}} readOnly />
          </div>
        </div>
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
      </FormValidation>
    );
  }

  gotoBasePath = () => {
    const { history } = this.props;
    history.push("/peminjaman-list");
  }

  onReturnBook = async () => {
    const { id } = this.state;

    await graphqlApi.returnBook(id);

    this.gotoBasePath();
  }

  saveDataHandler = async () => {
    const {
      form, type,
    } = this.state;
    let notifValue = null;

    this.setState({
      isFormSubmitted: true,
    });

    this.updateButtonsState(true, true);

    try {
      const isFormValid = await this.form.validateForm();

      if (isFormValid) {
        this.setLoading(true);

        const payload = {
          ...form,
          book_id: form.book.id,
          member_id: form.member.id,
        };
        delete payload.book;
        delete payload.member;
        if (type === "create") {
          await graphqlApi.borrowBook(payload);
          notifValue = {
            title: "Berhasil",
            message: "Peminjaman buku tersimpan",
            level: "success",
          };
        }

        this.setLoading(false);
      }
    } catch (e) {
      notifValue = {
        title: "Peminjaman Gagal",
        message: catchError(e),
        level: "error",
      };
      this.setLoading(false);
    }

    this.updateButtonsState(false, true);

    if (notifValue) {
      this.doShowingNotification(notifValue);
      if (notifValue.level === "success") this.gotoBasePath();
      if (notifValue.level === "error") this.updateButtonsState();
    }
  }

  renderPanelBody = () => {
    const { type, footerButtons } = this.state;

    if (type === "create") {
      return (
        <div className="panel-body">
            {this.formComponent()}
            <div className="row">
              <div className="col-sm-8" />
              <div className="col-sm-4 text-right">
                {footerButtons.map((x, i) => (<button key={x.id} style={(i === footerButtons.length - 1) ? {} : { marginRight: "10px" }} type="button" className={`btn ${x.type ? `btn-${x.type}` : ""}`} onClick={!x.isDisabled ? x.action : () => { }} disabled={x.isDisabled}>{x.content}</button>))}
              </div>
            </div>
        </div>
      );
    }

    if (type === "detail") {
      return (
        <div className="panel-body">
            {this.detailComponent()}
        </div>
      );
    }

    return null;
  }

  render = () => {
    const { type } = this.state;
    let title = "";

    if (type === "create") {
      title = "Peminjaman Baru";
    } else if (type === "detail") {
      title = "Detail Peminjaman";
    }

    return (
      <div style={{ width: "80%", position: "relative", margin: "0px auto" }}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row mb-reset">
              <div className="col-sm-12">
                <h3 className="panel-title">{title}</h3>
              </div>
            </div>
          </div>
          {this.renderPanelBody()}
        </div>
      </div>
    );
  }
}

export default PeminjamanDetail;
