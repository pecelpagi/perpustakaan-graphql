import React from "react";


class OverlayLoading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  startLoading = () => {
    this.setState({ show: true });
  }

  endLoading = () => {
    this.setState({ show: false });
  }

  render() {
    const { show } = this.state;

    if (!show) return null;

    return (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgb(51 51 51 / 51%)",
              zIndex: 2,
              color: "#FFF",
              display: "flex",
              alignItems: "center",
            }}>
                <h5
                    style={{
                      textAlign: "center",
                      display: "block",
                      width: "100%",
                      fontSize: "18px",
                    }}
                >Mohon Tunggu Sebentar ...</h5>
            </div>
    );
  }
}

export default OverlayLoading;
