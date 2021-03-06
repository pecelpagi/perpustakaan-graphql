/* eslint prop-types: 0 */
import React from "react";
import * as graphqlApi from "../../data";
import Table from "../../components/Table";
import { createPathPreview, checkIsMember } from "../../utils";

const isAdmin = !checkIsMember();
const columns = [
  {
    id: "code",
    title: "Nomor Panggil",
    width: "15%",
  },
  {
    id: "title",
    title: "Judul",
    width: "30%",
  },
  {
    id: "author",
    title: "Pengarang",
  },
  {
    id: "cover",
    title: "Sampul",
    customComponent: val => (<img src={createPathPreview(val)} style={{ width: "70px" }} />),
  },
  {
    id: "qty_text",
    title: "Ketersediaan",
  },
];
class Book extends React.Component {
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
      "Daftar Koleksi",
    ]);
  }

  onClickRow = (data) => {
    const { history } = this.props;
    history.push(`/book/detail/${data.id}`);
  }

  callCreateHandler = () => {
    const { history } = this.props;
    history.push("/book/create");
  }

  onFetchData = async (state) => {
    const { match: { params } } = this.props;

    if (params.id_category) {
      Object.assign(state, {
        category_id: params.id_category
      });
    }

    const res = await graphqlApi.getBooks(state);
    const { books: data, meta_data: metaData } = res;
    const newData = data.map(x => (Object.assign({}, x, {
      qty_text: `${x.qty} eksemplar`,
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
          withWrapperRender={({ makeTable, InputSearch, PageSize }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-3">
                    <h3 className="panel-title">Daftar Koleksi</h3>
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

export default Book;
