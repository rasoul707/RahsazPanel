import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import Select from "react-select";
import { reactSelectStyles } from ".";
import { useDeepEffect } from "Utils/hooks";

export default function SimpleSelect({
  control,
  setValue,
  name,
  rules,
  classes,
  options,
  styles,
  components,
  defaultValue,
  shouldCheckValidDefault,
  disabled,
  inModal,
  entireObject,
  onChange,
  autoFindValue,
  withoutControl,
  ...restProps
}) {
  const [selectValue, setSelectValue] = useState();

  // handle change default value
  useDeepEffect(() => {
    if (defaultValue) {
      if (shouldCheckValidDefault) {
        const isDefaultValueValid = options.find(
          item =>
            item.label === defaultValue.label &&
            item.value === defaultValue.value,
        );
        if (!isDefaultValueValid) return;
      }

      if (autoFindValue && options?.length) {
        console.log("boooooooooous")
        const temp = options.find(item => item.value === defaultValue);
        if (temp) {

          setValue(name, entireObject ? temp : temp?.value);
          setSelectValue(temp);
        }
      } else {
        setValue(name, entireObject ? defaultValue : defaultValue?.value);
        setSelectValue(defaultValue);
      }
    }
    else {
      setSelectValue(null);
    }
  }, [defaultValue, options]);

  // handle select change
  const onSelectChange = selected => {
    setValue(name, entireObject ? selected : selected?.value);
    setSelectValue(selected);
    if (onChange) onChange(entireObject ? selected : selected?.value);
  };

  const otherStyles = {
    ...reactSelectStyles,
    ...styles,
  };

  return withoutControl ? (
    <Select
      id={name}
      name={name}
      value={selectValue}
      styles={otherStyles}
      classNamePrefix="ThirdlyUI"
      className={clsx(classes?.select, "ThirdlyUI_InputSelect")}
      isDisabled={disabled}
      options={options}
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
        <Select
          id={name}
          name={name}
          value={selectValue}
          styles={otherStyles}
          classNamePrefix="ThirdlyUI"
          className={clsx(classes?.select, "ThirdlyUI_InputSelect")}
          isDisabled={disabled}
          options={options}
          components={{ IndicatorSeparator: null, ...components }}
          onChange={onSelectChange}
          isClearable
          menuPortalTarget={inModal ? document.body : undefined}
          menuPosition={inModal ? "fixed" : undefined}
          {...restProps}
        />
      )}
    />
  );
}
