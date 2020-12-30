/* eslint prop-types: 0 */
import React from "react";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";

const columns = fn => [
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
    customComponent: val => (
      <div>
        <button type="button" className="btn btn-sm" onClick={() => { fn("view", val); }}><i className="fa fa-search" />{" "}Cari Koleksi</button>
        &nbsp;&nbsp;
        <button type="button" className="btn btn-sm" onClick={() => { fn("edit", val); }}><i className="fa fa-edit" />{" "}Edit Data</button>
      </div>
    ),
    width: "20%",
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
    const { assignButtons, assignBreadcrumbs } = this.props;

    assignButtons([{
      id: "1", title: "Tambah Data", icon: "fa fa-plus-square", clickEvent: () => this.callCreateHandler(),
    }]);

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
