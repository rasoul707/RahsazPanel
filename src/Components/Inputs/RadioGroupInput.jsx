import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Radio } from "antd";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";

export default function RadioGroupInput({
  label,
  name,
  classes,
  rules,
  defaultValue,
  showError,
  errorMessage,
  onChange,
  withoutControl,
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [radioValue, setRadioValue] = useState();

  // handle change default value
  useEffect(() => {
    setValue(name, defaultValue);
    setRadioValue(defaultValue);
  }, [defaultValue]);

  // handle radio change
  const onRadioChange = e => {
    setValue(name, e.target.value, { shouldValidate: true });
    setRadioValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className={clsx(classes?.root, "ThirdlyUI_InputRoot")}>
      {label && (
        <label className={clsx(classes?.label, "ThirdlyUI_InputLabel")}>
          {label}
        </label>
      )}

      {withoutControl ? (
        <Radio.Group
          name={name}
          className={clsx(classes?.radioWrapper, "ThirdlyUI_RadioGroup")}
          value={radioValue}
          defaultValue={defaultValue}
          onChange={onRadioChange}
          {...restProps}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={props => (
            <Radio.Group
              name={name}
              className={clsx(classes?.radioWrapper, "ThirdlyUI_RadioGroup")}
              value={radioValue}
              defaultValue={defaultValue}
              onChange={onRadioChange}
              {...restProps}
            />
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
