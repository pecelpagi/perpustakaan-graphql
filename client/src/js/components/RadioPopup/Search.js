/* eslint prop-types: 0 */
import React from "react";

class Search extends React.Component {
  changeSearchTextHandler = (e) => {
    const { changeEvent } = this.props;
    changeEvent(e.target.value);
  }

  render() {
    const { value } = this.props;

    return (
      <div>
        <input
          className="form-control popup-data__input-search"
          type="text"
          onChange={this.changeSearchTextHandler}
          placeholder="Pencarian ..."
          value={value}
        />
      </div>
    );
  }
}

export default Search;
