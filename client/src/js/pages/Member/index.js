/* eslint prop-types: 0 */
import React from "react";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";

const columns = [
  {
    id: "registration_number",
    title: "No Induk",
  },
  {
    id: "name",
    title: "Nama",
  },
  {
    id: "address",
    title: "Alamat",
  },
];
class Member extends React.Component {
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
        label: "Keanggotaan", link: "#",
      },
      "Kelola Anggota",
    ]);
  }

  onClickRow = (data) => {
    const { history } = this.props;
    history.push(`/member/edit/${data.id}`);
  }

  callCreateHandler = () => {
    const { history } = this.props;
    history.push("/member/create");
  }

  onFetchData = async (state) => {
    const res = await graphqlApi.getMembers(state);
    const { members, meta_data: metaData } = res;

    return { data: members, totalPage: metaData.total_page };
  }

  render() {
    return (
      <div>
        <Table
          rowClick={this.onClickRow}
          columns={columns}
          onFetch={this.onFetchData}
          withWrapperRender={({ makeTable, InputSearch, PageSize }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-3">
                    <h3 className="panel-title">Kelola Anggota</h3>
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

export default Member;
