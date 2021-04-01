/* eslint prop-types: 0 */
import React from "react";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";
import { checkIsMember } from "../../utils";

const isAdmin = !checkIsMember();
const columns = (fn, isAuthenticated) => [
  {
    id: "code",
    title: "Kode",
  },
  {
    id: "name",
    title: "Nama Kategori",
  },
  {
    id: "option",
    title: "",
    customComponent: (val) => {
      let retval = (
        <div>
          <button type="button" className="btn btn-sm" onClick={() => { fn("view", val); }}><i className="fa fa-search" />{" "}Cari Koleksi</button>
        </div>
      );

      if (isAuthenticated) {
        retval = (
          <div>
            <button type="button" className="btn btn-sm" onClick={() => { fn("view", val); }}><i className="fa fa-search" />{" "}Cari Koleksi</button>
            &nbsp;&nbsp;
            {isAdmin && <button type="button" className="btn btn-sm" onClick={() => { fn("edit", val); }}><i className="fa fa-edit" />{" "}Edit Data</button>}
          </div>
        );
      }

      return retval;
    },
    width: isAdmin ? "20%" : "10%",
  },
];
class Category extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount = () => {
    const { assignButtons, assignBreadcrumbs, isAuthenticated } = this.props;

    if (isAuthenticated && isAdmin) {
      assignButtons([{
        id: "1", title: "Tambah Data", icon: "fa fa-plus-square", clickEvent: () => this.callCreateHandler(),
      }]);
    } else {
      assignButtons([]);
    }

    assignBreadcrumbs([
      {
        label: "App", link: "#",
      },
      {
        label: "Koleksi Pustaka", link: "#",
      },
      "Daftar Kategori",
    ]);
  }

  onClickRow = (type, id) => {
    const { history } = this.props;

    if (type === "edit") {
      history.push(`/category/edit/${id}`);
    } else {
      history.push(`/books/${id}`);
    }
  }

  callCreateHandler = () => {
    const { history } = this.props;
    history.push("/category/create");
  }

  onFetchData = async (state) => {
    const res = await graphqlApi.getCategories(state);
    const { categories, meta_data: metaData } = res;
    const newData = categories.map(x => (Object.assign({}, x, { option: x.id })));

    return { data: newData, totalPage: metaData.total_page };
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <div>
        <Table
          rowClick={() => {}}
          columns={columns(this.onClickRow, isAuthenticated)}
          onFetch={this.onFetchData}
          withWrapperRender={({ makeTable, InputSearch, PageSize }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-3">
                    <h3 className="panel-title">Daftar Kategori</h3>
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

export default Category;
