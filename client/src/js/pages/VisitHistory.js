/* eslint prop-types: 0 */
import React from "react";
import moment from "moment";
import * as graphqlApi from "../data";
import Table from "../components/Table";
import { checkIsMember } from "../utils";

const columns = (fn) => {
  const columnData = [
    {
      id: "attendance_date",
      title: "Tanggal Kunjungan",
      width: "20%",
    },
    {
      id: "registration_number",
      title: "No Induk",
    },
    {
      id: "member_name",
      title: "Nama Anggota",
    },
  ];

  if (!checkIsMember()) {
    columnData.push({
      id: "option",
      title: "",
      customComponent: (id, rowData) => {
        const retval = (
          <div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => { fn(rowData); }}
            ><i className="fa fa-id-card-o" />&nbsp;&nbsp;&nbsp;Data Pengunjung</button>
          </div>
        );

        return retval;
      },
      width: "20%",
    });
  }

  return columnData;
};
class VisitHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount = () => {
    const { assignButtons, assignBreadcrumbs } = this.props;

    assignButtons([]);

    assignBreadcrumbs([
      {
        label: "App", link: "#",
      },
      "Riwayat Kunjungan",
    ]);
  }

  onClickRow = (rowData) => {
    const { history } = this.props;
    history.push(`/member/edit/${rowData.member_id}`);
  }

  onFetchData = async (state) => {
    const res = await graphqlApi.getAttendances(state);
    const { attendances, meta_data: metaData } = res;
    const newData = attendances.map(x => (Object.assign({}, x, {
      attendance_date: moment(x.attendance_date, "YYYY-MM-DD").format("DD MMMM YYYY"),
      member_name: x.member.name,
      member_id: x.member.id,
      option: x.id,
    })));

    return { data: newData, totalPage: metaData.total_page };
  }

  render() {
    return (
      <div>
        <Table
          rowClick={() => {}}
          columns={columns(this.onClickRow)}
          onFetch={this.onFetchData}
          withWrapperRender={({ makeTable, InputSearch, PageSize }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-3">
                    <h3 className="panel-title">Riwayat Kunjungan</h3>
                  </div>
                  <div className="col-sm-9">
                    <div className="displayCount">
                      <PageSize />
                    </div>
                    <div className="filter-container">
                      <InputSearch />
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

export default VisitHistory;
