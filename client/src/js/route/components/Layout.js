/* eslint prop-types: 0 */
import React from "react";
import NotificationSystem from "react-notification-system";
import OverlayLoading from "./OverlayLoading";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttons: [],
      breadcrumbData: [],
    };
  }

  assignButtonsHandler = (buttons) => {
    this.setState({ buttons });
  }

  assignBreadcrumbsHandler = (breadcrumbData) => {
    this.setState({ breadcrumbData });
  }

  renderBreadcrumb = () => {
    const { breadcrumbData } = this.state;

    if (breadcrumbData.length > 0) {
      const breadcrumbs = breadcrumbData.map((x) => {
        const isObject = typeof x === "object";

        if (isObject) {
          return (<li key={x.label}><a href={x.link}>{x.label}</a></li>);
        }

        return (<li className="active" key={x}>{x}</li>);
      });

      return (
        <ol className="breadcrumb">
          {breadcrumbs}
        </ol>
      );
    }

    return null;
  }

  renderButtons = () => {
    const { buttons } = this.state;

    return buttons.map(x => (<div key={x.id} className="item">
      <button className="btn btn-primary" type="button" onClick={x.clickEvent}><i className={x.icon} /> {x.title}</button>
    </div>));
  }

  renderButtonsAndBreadcrumbs = () => {
    const { buttons, breadcrumbData } = this.state;

    if (buttons.length === 0 && breadcrumbData.length === 0) {
      return null;
    }

    return (
      <div>
          <div style={{ display: "inline-block", width: "50%" }}>
            {this.renderBreadcrumb()}
          </div>
          <div style={{ display: "inline-block", width: "50%", textAlign: "right" }}>
            {this.renderButtons()}
          </div>
        </div>
    );
  }

  startLoading = () => {
    this.overlayLoading.startLoading();
  }

  endLoading = () => {
    this.overlayLoading.endLoading();
  }

  addNotification = (val) => {
    this.notificationSystem.addNotification(val);
  };

  render() {
    const { children } = this.props;

    const childrenWithProps = React.Children.map(
      children,
      child => React.cloneElement(child, {
        assignButtons: this.assignButtonsHandler,
        assignBreadcrumbs: this.assignBreadcrumbsHandler,
        addNotification: this.addNotification,
        startLoading: this.startLoading,
        endLoading: this.endLoading,
      }),
    );

    return (
      <div className="page-content">
        {this.renderButtonsAndBreadcrumbs()}
        {childrenWithProps}
        <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
        <OverlayLoading ref={(c) => { this.overlayLoading = c; }} />
      </div>
    );
  }
}

export default Layout;
