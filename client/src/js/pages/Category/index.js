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
    this.fetchData();
  }

  fetchData = async () => {
    const res = await graphqlApi.getCategories();

    this.setState({ data: res.categories });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <Table
          columns={columns}
          data={data}
          withWrapperRender={({ makeTable }) => (
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Daftar Kategori</h3>
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
