/* eslint prop-types: 0 */
import React from "react";
import update from "immutability-helper";
import { FieldFeedbacks, FieldFeedback } from "react-form-with-constraints";
import FormValidation from "~/components/FormValidation";
import * as graphqlApi from "../data";
import { setToken, catchError, } from "../utils";
import InputText from "../components/InputText";

class Login extends React.Component {
  initialButtonActions = [
    {
      id: "0",
      type: "primary btn-block",
      content: (
        <span>
          Login
        </span>
      ),
      action: () => this.doLoggingIn(),
      isDisabled: false,
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      isFormSubmitted: false,
      form: {
        username: "",
        password: "",
      },
      footerButtons: this.initialButtonActions,
    };
  }

  doShowingNotification = (val) => {
    const { addNotification } = this.props;
    addNotification(val);
  }

  onInputChangeValidate = ({ target }) => {
    this.form.validateInput(target);

    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }

    this.inputTimeout = setTimeout(() => {
      if (this.form.simpleValidateForm()) {
        this.updateButtonsState();
      } else {
        this.updateButtonsState(true);
      }
    }, 300);
  }

  updateButtonsState = (isBtnDisabled = false) => {
    const footerButtons = update(this.initialButtonActions, {
      0: { isDisabled: { $set: isBtnDisabled } },
    });

    this.setState({ footerButtons });
  }

  changeValueHandler = async (type, val, e) => {
    const { form, isFormSubmitted } = this.state;

    if (isFormSubmitted && e) {
      await this.onInputChangeValidate(e);
    }

    const newValue = update(form, {
      [type]: { $set: val },
    });

    this.setState({ form: newValue });
  }

  doLoggingIn = async () => {
    const { form } = this.state;
    this.updateButtonsState(true);

    try {
      const isFormValid = await this.form.validateForm();

      if (isFormValid) {
        const res = await graphqlApi.login(form);

        if (res.token) {
          setToken(res.token);
          location.href = "/books";
        }
      }
    } catch (e) {
      this.doShowingNotification({
        title: "Login Gagal",
        message: catchError(e),
        level: "error",
      });
      this.updateButtonsState(false);
    }

    this.setState({
      isFormSubmitted: true,
    });
  }

  renderForm = () => {
    const { form } = this.state;

    return [
      (
        <div key="username" className="row mb-sm">
          <div className="col-sm-12">
            <InputText
              label="Username"
              name="username"
              value={form.username}
              changeEvent={(val, e) => { this.changeValueHandler("username", val, e); }}
              required
            />
            <FieldFeedbacks for="username">
              <FieldFeedback when="valueMissing">Username masih kosong</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
      ),
      (
        <div key="password" className="row mb-sm">
          <div className="col-sm-12">
            <InputText
              label="Password"
              name="password"
              value={form.password}
              changeEvent={(val, e) => { this.changeValueHandler("password", val, e); }}
              required
            />
            <FieldFeedbacks for="password">
              <FieldFeedback when="valueMissing">Password masih kosong</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </div>
      ),
    ];
  }

  render() {
    const { footerButtons } = this.state;

    return (
      <div className="form-login">
        <div className="panel panel-default">
          <div className="panel-heading"><h3 className="panel-title">Login Perpustakaan</h3></div>
          <div className="panel-body">
            <FormValidation ref={(c) => { this.form = c; }}>
              {this.renderForm()}
              {footerButtons.map(x => (
                <button key={x.id}
                  type="submit"
                  className={`btn ${x.type ? `btn-${x.type}` : ""}`}
                  onClick={!x.isDisabled ? x.action : () => { }}
                  disabled={x.isDisabled}>{x.content}</button>))}
            </FormValidation>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
