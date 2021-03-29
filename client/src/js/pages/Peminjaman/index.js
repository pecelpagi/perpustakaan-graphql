/* eslint prop-types: 0 */
import React from "react";
import moment from "moment";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";

const columns = [
  {
    id: "code",
    title: "Kode Transaksi",
    width: "12%",
  },
  {
    id: "book_title",
    title: "Judul",
    width: "25%",
  },
  {
    id: "member_name",
    title: "Peminjam",
    width: "20%",
  },
  {
    id: "borrow_date_formatted",
    title: "Tanggal Pinjam",
  },
  {
    id: "return_date_formatted",
    title: "Tanggal Kembali",
  },
  {
    id: "max_return_date_formatted",
    title: "Max. Pengembalian",
  },
  {
    id: "late_charge",
    title: "Denda",
  },
];
class Peminjaman extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount = () => {
    const { assignButtons, assignBreadcrumbs } = this.props;

    assignButtons([{
      id: "1", title: "Tambah Data", icon: "fa fa-plus-square", clickEvent: () => this.callCreateHandler(),
    }]);

    assignBreadcrumbs([
      {
        label: "App", link: "#",
      },
      {
        label: "Peminjaman", link: "#",
      },
      "Status Peminjaman",
    ]);
  }

  onClickRow = (data) => {
    const { history } = this.props;
    history.push(`/peminjaman/detail/${data.id}`);
  }

  callCreateHandler = () => {
    const { history } = this.props;
    history.push("/peminjaman/pinjam");
  }

  onFetchData = async (state) => {
    const res = await graphqlApi.getBorrowings(state);
    const { borrowings: data, meta_data: metaData } = res;
    const newData = data.map(x => (Object.assign({}, x, {
      book_title: `${x.book.code}: ${x.book.title}`,
      member_name: `${x.member.registration_number}: ${x.member.name}`,
      borrow_date_formatted: moment(x.borrow_date, "YYYY-MM-DD").format("DD MMMM YYYY"),
      return_date_formatted: x.return_date !== "-" ? moment(x.return_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "Belum Dikembalikan",
      max_return_date_formatted: moment(x.max_return_date, "YYYY-MM-DD").format("DD MMMM YYYY"),
      late_charge: x.late_charge || 0,
    })));

    return { data: newData, totalPage: metaData.total_page };
  }

  render() {
    return (
      <div>
        <Table
          rowClick={this.onClickRow}
          columns={columns}
          onFetch={this.onFetchData}
          withWrapperRender={({ makeTable, PageSize }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-3">
                    <h3 className="panel-title">Status Peminjaman</h3>
                  </div>
                  <div className="col-sm-9">
                    <div className="displayCount">
                      <PageSize />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-body">
                {makeTable()}
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default Peminjaman;
