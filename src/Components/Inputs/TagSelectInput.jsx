import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";
import { Select, Space } from "antd";
import { makeStyles } from "@material-ui/core";
const options = [];

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({
    label: `Long Label: ${value}`,
    value,
  });
}

const useStyles = makeStyles({
  wrapper: {
    width: "100%",
    position: "relative",
    "& .ant-select-selector": {
      width: "80%",
      border: "none !important",
      outline: "none !important",
      boxShadow: "none !important",
      flexWrap: "nowrap !important",
    },
  },
  dropdown: {
    zIndex: 10000,
  },
  miniSelect: {
    position: "absolute",
    top: 16,
    right: 20,
    border: "none",
    outline: "none",
  },
  select: {
    "& .ant-select-selection-overflow": {
      padding: "7px 9px",
    },

    "& .ant-select-selection-placeholder": {
      left: 20,
    },
    "& .ant-select-selection-item": {
      height: "30px",
      background: "#1458EA",
      color: "#fff",
      border: "none",
      borderRadius: 3,
      padding: "4px 8px",
      fontWeight: 600,
      fontSize: 12,
      "& .ant-select-selection-item-remove": {
        color: "#fff",
        marginLeft: 6,
      },
    },
  },
});

export default function TagInput({
  label,
  name,
  classes,
  rules,
  defaultValue,
  showError,
  errorMessage,
  onChange,
  withoutControl,
  tagOptions,
  tagInputName,
  miniSelectOptions,
  miniSelectName,
  hideMiniSelect,
  ...restProps
}) {
  const localClasses = useStyles();
  const { control, errors, setValue } = useHandleForm(withoutControl);

  useEffect(() => {
    // handle change default value
    if (defaultValue && Array.isArray(defaultValue)) {
      setValue(tagInputName, defaultValue);
    }
    // handle select first item of mini select option
    if (miniSelectOptions?.length && Array.isArray(miniSelectOptions)) {
      setValue(miniSelectName, miniSelectOptions[0].value);
    }
  }, [JSON.stringify(defaultValue)]);

  const handleSelectTag = val => {
    setValue(tagInputName, val);
  };

  const handleMiniSelect = e => {
    setValue(miniSelectName, e.target.value);
  };

  const selectProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: tagOptions,
    defaultValue,
    onChange: handleSelectTag,
    placeholder: "Select Item...",
    maxTagCount: "responsive",
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
        <div className={clsx(classes?.tag, "ThirdlyUI_InputTag")}>
          {withoutControl ? (
            <div className={localClasses.wrapper}>
              <Select
                dropdownClassName={localClasses.dropdown}
                {...selectProps}
              />
              {!hideMiniSelect && (
                <select onChange={handleMiniSelect}>
                  {miniSelectOptions?.map(item => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <Controller
              control={control}
              name={tagInputName}
              rules={{
                validate: {
                  required: value => {
                    if (!rules?.required) return true;
                    if (value?.length > 0) {
                      return true;
                    } else {
                      return typeof rules.required === "string"
                        ? rules.required
                        : "";
                    }
                  },
                  min: value => {
                    if (!rules?.min) return true;
                    const min = rules.min?.value ? rules.min.value : rules.min;
                    const message = rules.min?.message ? rules.min.message : "";
                    if (value?.length >= min) {
                      return true;
                    } else {
                      return message;
                    }
                  },
                },
              }}
              defaultValue={defaultValue}
              render={props => (
                <div className={localClasses.wrapper}>
                  <Select
                    className={localClasses.select}
                    dropdownClassName={localClasses.dropdown}
                    {...selectProps}
                  />
                  {!hideMiniSelect && (
                    <Controller
                      control={control}
                      name={miniSelectName}
                      render={props => (
                        <select
                          onChange={handleMiniSelect}
                          className={localClasses.miniSelect}
                        >
                          {miniSelectOptions?.map(item => (
                            <option value={item.value} key={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  )}
                </div>
              )}
            />
          )}
        </div>
      </div>

      <div className={clsx(classes?.error, "ThirdlyUI_InputErrorMessage")}>
        {(showError || errors.hasOwnProperty(name)) && (
          <span>
            {errorMessage
              ? errorMessage
              : errors[name]?.message && errors[name].message !== ""
              ? errors[name].message
              : "Please fill out the field"}
          </span>
        )}
      </div>
    </div>
  );
}
