import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";
import { phoneSelectStyles, phoneOptions } from "./InputUtils";
import SimpleSelect from "./InputUtils/SimpleSelect";
import NumberFormat from "react-number-format";

export default function PhoneInput({
  // for both
  label,
  classes,
  disabled,
  showError,
  errorMessage,
  onChange,
  withoutControl,

  // for input
  name,
  rules,
  defaultValue,
  inputProps,
  entireObject,

  // for code select
  codeName,
  customCodes,
  codeStyles,
  codeDefaultValue,
  codeProps,
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [inputValue, setInputValue] = useState({ value: "" });
  const [defaultCode, setDefaultCode] = useState(phoneOptions[0]);
  const [codeValue, setCodeValue] = useState(phoneOptions[0].value);

  // handle change default value code
  useEffect(() => {
    if (codeDefaultValue && !isNaN(Number(codeDefaultValue))) {
      const codeItem = phoneOptions.find(
        item => item.value === Number(codeDefaultValue),
      );
      if (!codeItem) return;
      setDefaultCode(codeItem);
      setCodeValue(codeItem.value);
      setValue(codeName, codeItem.value);
    }
  }, [codeDefaultValue]);

  // handle change default value
  useEffect(() => {
    if (defaultValue && !isNaN(Number(defaultValue))) {
      setInputValue({ value: defaultValue });
      setValue(name, defaultValue);
    }
  }, [defaultValue]);

  const onInputChange = values => {
    setInputValue(values);

    if (onChange)
      onChange({
        [name]: entireObject ? values : values.value,
        [codeName]: codeValue,
      });
  };

  const onSelectChange = selected => {
    setCodeValue(selected);
    if (onChange)
      onChange({
        [name]: entireObject ? inputValue : inputValue.value,
        [codeName]: selected,
      });
  };

  const otherStyles = {
    ...phoneSelectStyles,
    ...codeStyles,
  };

  const otherRules = {
    minLength: {
      value: 11,
      message: "Length of phone number should be 11",
    },
    ...rules,
  };

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
        style={{ display: "flex" }}
      >
        <div>
          <SimpleSelect
            control={control}
            setValue={setValue}
            name={codeName}
            classes={classes}
            options={phoneOptions}
            styles={otherStyles}
            defaultValue={defaultCode}
            disabled={disabled}
            onChange={onSelectChange}
            withoutControl={withoutControl}
            placeholder=""
            isClearable={false}
            {...codeProps}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          {withoutControl ? (
            <NumberFormat
              format="### ### #####"
              placeholder="--- --- -----"
              mask="-"
              id={name}
              name={name}
              className={clsx(classes?.phoneInput, "ThirdlyUI_Input")}
              value={inputValue.value}
              disabled={disabled}
              onValueChange={onInputChange}
              {...inputProps}
            />
          ) : (
            <Controller
              control={control}
              name={name}
              rules={otherRules}
              defaultValue={defaultValue}
              render={props => (
                <NumberFormat
                  format="### ### #####"
                  placeholder="--- --- -----"
                  mask="-"
                  id={name}
                  name={name}
                  className={clsx(classes?.phoneInput, "ThirdlyUI_Input")}
                  value={inputValue.value}
                  disabled={disabled}
                  onValueChange={values => {
                    props.onChange(entireObject ? values : values.value);
                    onInputChange(values);
                  }}
                  {...inputProps}
                />
              )}
            />
          )}
        </div>
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
