/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import Search from "./Search";
import ColumnHeader from "./ColumnHeader";
import ColumnBody from "./ColumnBody";

require("./styles.scss");

let allDataLoaded = false;
let allData = [];

class ModalPopup extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    hideModal: PropTypes.func,
    saveHandler: PropTypes.func,
    title: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    })),
    columns: PropTypes.arrayOf(PropTypes.shape({
      accessor: PropTypes.string,
      Header: PropTypes.string,
      width: PropTypes.string,
    })).isRequired,
    onFetch: PropTypes.func,
  }

  static defaultProps = {
    hideModal: () => {},
    width: 320,
    saveHandler: () => {},
    title: "",
    onFetch: undefined,
    data: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      btnDisabled: false,
      btnText: "",
      page: 1,
      popupData: [],
      sortType: "asc",
      fieldToSort: props.columns.length > 0 ? props.columns[0].accessor : "",
      filterText: "",
      loading: false,
      choosenVal: props.value,
    };
  }

  componentDidMount = () => {
    const isServerSide = this.checkServerSide();

    if (isServerSide) {
      this.fetchDataHandler();
    } else {
      this.setupData(this.props);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setupData(this.props, nextProps);
  }

  checkServerSide = () => {
    const { onFetch, data } = this.props;
    const isServerSide = !data && onFetch;

    return isServerSide;
  }

  setupData = (props, nextProps = null) => {
    let newProps = props;
    let ableToUpdate = !!newProps.data;
    if (nextProps) {
      newProps = nextProps;
      if (newProps.data) {
        const isDifferent = props.data !== newProps.data;
        ableToUpdate = isDifferent;
      }
    }

    if (ableToUpdate) {
      allData = newProps.data;
      this.setState({ popupData: newProps.data });
    }
  }

  applyValue = () => {
    const { btnDisabled, choosenVal } = this.state;

    if (!btnDisabled) {
      const { saveHandler } = this.props;
      this.setState({
        btnDisabled: true,
        btnText: "Tunggu ...",
      });

      saveHandler(choosenVal, this.buttonCallback);
    }
  }

  hideModalHandler = () => {
    const { btnDisabled } = this.state;
    const { hideModal } = this.props;

    if (!btnDisabled) {
      hideModal();
    }
  }

  buttonCallback = () => {
    this.setState({
      btnDisabled: false,
      btnText: "",
    });
  }

  fetchDataHandler = async () => {
    const {
      page, sortType, fieldToSort, filterText, popupData,
    } = this.state;
    const { onFetch } = this.props;

    this.setState({ loading: true });

    const res = await onFetch({
      page, filterText, sortType, fieldToSort,
    });

    const newData = [...popupData, ...res.data];

    this.setState({ loading: false, popupData: newData });

    allDataLoaded = (page >= res.payload.total_page);
  }

  fetchNextData = () => {
    const isServerSide = this.checkServerSide();

    if (!allDataLoaded && isServerSide) {
      this.setState(prevState => ({ page: prevState.page + 1 }), () => {
        this.fetchDataHandler();
      });
    }
  }

  changeSearchHandler = (val) => {
    const isServerSide = this.checkServerSide();

    this.setState({ filterText: val });

    clearTimeout(this.filterIdle);
    this.filterIdle = setTimeout(() => {
      this.setState({
        page: 1, filterText: val, popupData: [],
      }, () => {
        this.radioList.refreshScrollPosition();
        if (isServerSide) {
          this.fetchDataHandler();
        } else {
          this.doSearchingClientSide();
        }
      });
    }, 500);
  }

  doSearchingClientSide = () => {
    const { filterText } = this.state;

    const keySearch = "name";
    const filteredBySearch = allData.filter(item => (item[keySearch]).toLowerCase().includes(filterText.toLowerCase()));

    this.setState({ popupData: filteredBySearch });
  }

  sortHandler = (fieldToSort, sortType) => {
    this.setState({
      fieldToSort, sortType, page: 1, popupData: [],
    }, () => {
      this.radioList.refreshScrollPosition();
      this.fetchDataHandler();
    });
  }

  radioClickHandler = (val) => {
    this.setState({ choosenVal: val });
  }

  showIfDataEmpty = () => {
    const { popupData, filterText } = this.state;

    if (popupData.length === 0) {
      return (
        <div className="popup-overlay popup-overlay--show">
          <div className="popup-overlay__content">
           <div className="popup-overlay__content-caption">{filterText.length > 0 ? "Data tidak ditemukan" : "Data kosong"}</div>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      width,
      title,
      columns,
    } = this.props;
    const {
      btnDisabled,
      btnText,
      filterText,
      popupData,
      loading,
      sortType,
      fieldToSort,
      choosenVal,
    } = this.state;

    return (
      <div className="modal popup-data-modal" style={{ display: "block" }}>
        <div className="modal-dialog" style={{ width: `${width}px` }}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-left">{title}</h4>
            </div>
            <div className="modal-body" style={{ padding: "0px" }}>
              <div className="popup-data">
                <Search value={filterText} changeEvent={this.changeSearchHandler} />
                <div style={{ position: "relative" }}>
                  <ColumnHeader
                    columns={columns}
                    sortType={sortType}
                    fieldToSort={fieldToSort}
                    sortEvent={this.sortHandler}
                  />
                  <ColumnBody
                    ref={(c) => { this.radioList = c; }}
                    columns={columns}
                    data={popupData}
                    width={width}
                    height={250}
                    onFetch={this.fetchNextData}
                    value={choosenVal}
                    clickEvent={this.radioClickHandler}
                  />
                  <div className={`popup-overlay ${loading ? "popup-overlay--show" : "popup-overlay--hide"}`}>
                    <div className="popup-overlay__content">
                      <div className="popup-overlay__content-caption">Loading...</div>
                    </div>
                  </div>
                  {this.showIfDataEmpty()}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-default ${btnDisabled ? "disabled" : ""} pull-left`}
                onClick={this.hideModalHandler}>Batal</button>
              <button
                type="button"
                className={`btn btn-primary ${btnDisabled ? "disabled" : ""}`}
                onClick={this.applyValue}>{btnText || "Simpan"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalPopup;
