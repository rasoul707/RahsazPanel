import React from "react";
import PropTypes from "prop-types";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";

function NumberInput({
  label,
  name,
  classes,
  rules,
  defaultValue,

  showError,
  errorMessage,
  onChange,
  Adornments, // {start,end}
  beforeSelect,
  withoutControl,
  ...restProps
}) {
  const { register, errors } = useHandleForm(withoutControl);

  return (
    <div className={clsx(classes?.root, "ThirdlyUI_InputRoot")}>
      {label && (
        <label className={clsx(classes?.label, "ThirdlyUI_InputLabel")}>
          {label}
        </label>
      )}

      <div
        className={clsx(
          classes?.inputWrapper,
          "ThirdlyUI_InputWrapper",
          (showError || errors.hasOwnProperty(name)) && "ThirdlyUI_InputError",
        )}
      >
        {Adornments?.start && (
          <span className="ThirdlyUI_InputAdornments">{Adornments.start}</span>
        )}
        {beforeSelect && (
          <span className="ThirdlyUI_InputSelectBefore">{beforeSelect}</span>
        )}
        <input
          ref={withoutControl ? null : register(rules)}
          name={name}
          id={name}
          className={clsx(classes?.input, "ThirdlyUI_Input")}
          defaultValue={defaultValue}
          onChange={e => {
            if (onChange) onChange(e.target.value);
          }}
          {...restProps}
        />
        {Adornments?.end && (
          <span className="ThirdlyUI_InputAdornments">{Adornments.end}</span>
        )}
      </div>

      <div className={clsx(classes?.error, "ThirdlyUI_InputErrorMessage")}>
        {(showError || errors.hasOwnProperty(name)) && (
          <span>
            {errorMessage ||
              errors[name]?.message ||
              "Please fill out the field"}
          </span>
        )}
      </div>
    </div>
  );
}

export default NumberInput;

NumberInput.propTypes = {
  /**
   * input label content, can be string or complex element
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * name of the input, require if withoutControl isn't true
   */
  name: PropTypes.string,
  /**
   * classes that apply to elements in components like label, input, error etc.(list below)
   */
  classes: PropTypes.object,
  /**
   * rules for controlled inputs (based on react-hook-form)
   */
  rules: PropTypes.object,
  /**
   * default value for input
   */
  defaultValue: PropTypes.string,
  /**
   * if true always show error message and input get red border
   */
  showError: PropTypes.bool,
  /**
   * custom error message, can be string or complex element
   */
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * call function on every change for input
   */
  onChange: PropTypes.func,
  /**
   * if true, doesn't use react-hook-form for control and validate inputs, default use react-hook-form
   */
  withoutControl: PropTypes.bool,
};
