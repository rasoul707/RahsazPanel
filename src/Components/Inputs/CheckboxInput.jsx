import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Checkbox } from "antd";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";

export default function ChackboxInput({
  label,
  name,
  classes,
  rules,
  defaultValue,
  showError,
  errorMessage,
  onChange,
  withoutControl,
  zeroOne, // if true, value will be 1,0 instead of true/false
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [checkboxValue, setCheckboxValue] = useState(false);

  // handle change default value
  useEffect(() => {
    setValue(name, defaultValue);
    setCheckboxValue(defaultValue);
  }, [defaultValue]);

  // handle change
  const onChangeCheck = e => {
    setValue(name, e.target.checked, { shouldValidate: true });
    setCheckboxValue(e.target.checked);
    if (onChange) onChange(e.target.checked);
  };

  return (
    <div
      className={clsx(classes?.root, "ThirdlyUI_InputRoot")}
      style={{ marginBottom: 0 }}
    >
      {withoutControl ? (
        <Checkbox
          name={name}
          className={clsx(classes?.checkbox, "ThirdlyUI_Checkbox")}
          checked={checkboxValue}
          onChange={onChangeCheck}
          {...restProps}
        >
          {label && <span className={clsx(classes?.label)}>{label}</span>}
        </Checkbox>
      ) : (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={() => (
            <Checkbox
              name={name}
              className={clsx(classes?.checkbox, "ThirdlyUI_Checkbox")}
              checked={checkboxValue}
              onChange={onChangeCheck}
              {...restProps}
            >
              {label && <span className={clsx(classes?.label)}>{label}</span>}
            </Checkbox>
          )}
        />
      )}

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
