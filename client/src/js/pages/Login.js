/* eslint prop-types: 0 */
import React from "react";
import update from "immutability-helper";
import InputText from "../components/InputText";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        username: "",
        password: "",
      },
    };
  }

  changeValueHandler = async (type, val) => {
    const { form } = this.state;

    const newValue = update(form, {
      [type]: { $set: val },
    });

    this.setState({ form: newValue });
  }

  renderForm = () => {
    const { form } = this.state;

    return [
      (
        <div key="username" className="row mb-sm">
          <div className="col-sm-12">
            <InputText
              label="Username"
              value={form.username}
              changeEvent={(val) => { this.changeValueHandler("username", val); }}
            />
          </div>
        </div>
      ),
      (
        <div key="password" className="row mb-sm">
          <div className="col-sm-12">
            <InputText
              label="Password"
              value={form.password}
              changeEvent={(val) => { this.changeValueHandler("password", val); }}
            />
          </div>
        </div>
      ),
    ];
  }

  render() {
    return (
      <div className="form-login">
        <div className="panel panel-default">
          <div className="panel-heading"><h3 className="panel-title">Login Perpustakaan</h3></div>
          <div className="panel-body">
            {this.renderForm()}
            <button className="btn btn-primary btn-block" type="button">Login</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
