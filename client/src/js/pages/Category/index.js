/* eslint prop-types: 0 */
import React from "react";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";

const columns = [
  {
    id: "code",
    title: "Kode",
  },
  {
    id: "name",
    title: "Nama Kategori",
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

  callCreateHandler = () => {
    // 
  }

  onFetchData = async (state) => {
    const res = await graphqlApi.getCategories(state);
    const { categories, meta_data: metaData } = res;

    return { data: categories, totalPage: metaData.totalPage };
  }

  render() {
    return (
      <div>
        <Table
          columns={columns}
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
