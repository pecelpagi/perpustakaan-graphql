import React from "react";
import PropTypes from "prop-types";
import { FormWithConstraints } from "react-form-with-constraints";

export default class FormValidation extends React.Component {
    static propTypes = {
      children: PropTypes.node,
    }

    static defaultProps = {
      children: null,
    }

    simpleValidateForm = () => this.form.isValid();

    validateInput = async (target) => {
      await this.form.validateFields(target);
    }

    validateForm = async () => {
      const formValidatationResults = await this.form.validateForm();
      const formIsValid = this.simpleValidateForm();

      if (formIsValid) {
        return true;
      }

      try {
        formValidatationResults.forEach(({ name, validations }) => {
          if (validations) {
            validations.forEach(({ type, show }) => {
              if (type === "error" && show) {
                throw name;
              }
            });
          }
        });
      } catch (e) {
        const el = document.getElementsByName(e)[0];

        el.focus();
      }

      return false;
    }

    submitHandler = (event) => {
      event.preventDefault();
    }

    render() {
      const { children } = this.props;

      return (
            <FormWithConstraints
                ref={(c) => { this.form = c; }}
                onSubmit={this.submitHandler}
                noValidate
            >
                {children}
            </FormWithConstraints>
      );
    }
}