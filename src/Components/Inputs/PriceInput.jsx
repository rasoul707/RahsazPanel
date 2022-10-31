import React, { useState, useEffect } from "react";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";

function PriceInput({
  label,
  name,
  classes,
  rules,
  defaultValue,
  showError,
  errorMessage,
  onChange,
  withoutControl,
  prefix = "",
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);
  const [localValue, setLoaclValue] = useState("");

  // handle default value
  useEffect(() => {
    if (defaultValue) {
      setLoaclValue(defaultValue);
      setValue(name, defaultValue, { shouldValidate: true });
    }
  }, [defaultValue]);

  const onValueChange = ({ value }) => {
    setValue(name, value, { shouldValidate: true });
    setLoaclValue(value);
    if (onChange) onChange(value);
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
      >
        {withoutControl ? (
          <NumberFormat
            value={localValue}
            thousandSeparator={true}
            prefix={prefix}
            className={clsx(classes?.input, "ThirdlyUI_Input")}
            onValueChange={onValueChange}
            {...restProps}
          />
        ) : (
          <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={() => (
              <NumberFormat
                value={localValue}
                thousandSeparator={true}
                prefix={prefix}
                className={clsx(classes?.input, "ThirdlyUI_Input")}
                onValueChange={onValueChange}
                {...restProps}
              />
            )}
          />
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

export default PriceInput;
