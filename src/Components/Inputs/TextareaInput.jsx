import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";

export default function TextareaInput({
  label,
  name,
  rules,
  classes,
  defaultValue,
  showError,
  errorMessage,
  onChange,
  withoutControl,
  rows = "6",
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
        <textarea
          ref={withoutControl ? null : register(rules)}
          name={name}
          id={name}
          className={clsx(classes?.textarea, "ThirdlyUI_InputTextarea")}
          defaultValue={defaultValue}
          onChange={e => {
            if (onChange) onChange(e.target.value);
          }}
          rows={rows}
          {...restProps}
        />
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
