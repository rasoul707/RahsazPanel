import React, { useState, useEffect, useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import useHandleForm from "./InputUtils/useHandleForm";
import AsyncSelect from "react-select/async";
import { reactSelectStyles } from "./InputUtils";
import clsx from "clsx";
import debounce from "lodash.debounce";

export default function AsyncSelectInput({
  label,
  name,
  classes,
  rules,
  styles,
  components,
  defaultValue,
  disabled,
  inModal,
  isMulti,
  api,
  showError,
  errorMessage,
  entireObject,
  onChange,
  withoutControl,
  sendFullSelectedItem,
  exteraParams = {},
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [selectValue, setSelectValue] = useState();

  // handle change default value
  useEffect(() => {
    setValue(name, entireObject ? defaultValue : defaultValue?.value);
    setSelectValue(defaultValue);
  }, [defaultValue]);

  // handle select change
  const onSelectChange = (selected, item) => {
    setValue(
      name,
      entireObject
        ? selected
        : isMulti
        ? selected?.map(item => item.value)
        : selected?.value,
      {
        shouldValidate: true,
      },
    );
    setSelectValue(selected);
    if (onChange)
      onChange(
        entireObject
          ? selected
          : isMulti
          ? selected?.map(item => item.value)
          : sendFullSelectedItem
          ? selected
          : selected?.value,
      );
  };

  const otherStyles = {
    ...reactSelectStyles,
    ...styles,
  };

  const fetchRef = useRef(0);

  // api call
  async function apiCall(value) {
    return api({ search: value, ...exteraParams }).then(data => data);
  }

  const loadOptions = useMemo(() => {
    const loadOptions = (inputValue, callback) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      apiCall(inputValue).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        callback(newOptions);
      });
    };

    return debounce(loadOptions, 800);
  }, []);

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
          <AsyncSelect
            id={name}
            name={name}
            value={selectValue}
            styles={otherStyles}
            classNamePrefix="ThirdlyUI"
            className={clsx(classes?.select, "ThirdlyUI_InputSelect")}
            isDisabled={disabled}
            isMulti={isMulti}
            loadOptions={loadOptions}
            components={{ IndicatorSeparator: null, ...components }}
            onChange={onSelectChange}
            isClearable
            menuPortalTarget={inModal ? document.body : undefined}
            menuPosition={inModal ? "fixed" : undefined}
            {...restProps}
          />
        ) : (
          <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={props => (
              <AsyncSelect
                id={name}
                name={name}
                value={selectValue}
                styles={otherStyles}
                classNamePrefix="ThirdlyUI"
                className={clsx(classes?.select, "ThirdlyUI_InputSelect")}
                isDisabled={disabled}
                isMulti={isMulti}
                loadOptions={loadOptions}
                components={{ IndicatorSeparator: null, ...components }}
                onChange={onSelectChange}
                isClearable
                menuPortalTarget={inModal ? document.body : undefined}
                menuPosition={inModal ? "fixed" : undefined}
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
