import React from "react";
import PropTypes from "prop-types";
import useHandleForm from "./InputUtils/useHandleForm";
import SimpleSelect from "./InputUtils/SimpleSelect";
import clsx from "clsx";

export default function SelectInput({
  label,
  name,
  classes,
  showError,
  errorMessage,
  onChange,
  autoFindValue, // this will find defaultValue between options, defaultValue should only have value
  withoutControl,
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

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
        <SimpleSelect
          control={control}
          setValue={setValue}
          name={name}
          classes={classes}
          onChange={onChange}
          withoutControl={withoutControl}
          autoFindValue={autoFindValue}
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
