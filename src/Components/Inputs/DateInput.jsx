import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";
import { DatePicker } from "antd-jalali";
import moment from "moment";
import dayjs from "dayjs";
// Icons
import { ReactComponent as IconArrow2Left } from "Assets/img/icons/icon_arrow2_left.svg";
import { ReactComponent as IconArrow2Right } from "Assets/img/icons/icon_arrow2_right.svg";

export default function DateInput({
  label,
  name,
  classes,
  defaultValue,
  rules,
  entireObject,
  showError,
  errorMessage,
  onChange,
  arrowChange, //https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/01-add/
  CustomElement,
  withoutControl,
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [dateValue, setDateValue] = useState(defaultValue);

  // handle change default value
  useEffect(() => {
    if (defaultValue && moment(defaultValue).isValid()) {
      const date = moment(defaultValue);
      const dateString = defaultValue;
      setValue(name, entireObject ? { date, dateString } : dateString);
      setDateValue(date);
    }
  }, [defaultValue]);

  const onDateChange = (date, dateString) => {
    setValue(name, entireObject ? { date, dateString } : dateString, {
      shouldValidate: true,
    });
    setDateValue(date);
    if (onChange) onChange(entireObject ? { date, dateString } : dateString);
  };

  const prevArrowClick = () => {
    const newDate = moment(dateValue).subtract(1, arrowChange);
    onDateChange(newDate, newDate.format(restProps.format || "YYY-MM-DD"));
  };

  const nextArrowClick = () => {
    const newDate = moment(dateValue).add(1, arrowChange);
    onDateChange(newDate, newDate.format(restProps.format || "YYY-MM-DD"));
  };

  return (
    <div className={clsx(classes?.root, "ThirdlyUI_InputRoot")}>
      {label && (
        <label className={clsx(classes?.label, "ThirdlyUI_InputLabel")}>
          {label}
        </label>
      )}
      <div className="ThirdlyUI_DateWrapper">
        {arrowChange && (
          <div className="ThirdlyUI_DateArrow" onClick={prevArrowClick}>
            <IconArrow2Left />
          </div>
        )}

        <div
          className={clsx(
            classes?.inputWrapper,
            "ThirdlyUI_InputWrapper",
            (showError || errors.hasOwnProperty(name)) &&
              "ThirdlyUI_InputError",
          )}
        >
          {withoutControl ? (
            <DatePicker
              className={clsx(classes?.date, "ThirdlyUI_InputDate")}
              value={dateValue}
              onChange={onDateChange}
              allowClear={false}
              {...restProps}
            />
          ) : (
            <Controller
              control={control}
              name={name}
              rules={rules}
              defaultValue={dayjs(defaultValue, { jalali: true })}
              render={props => (
                <DatePicker
                  className={clsx(classes?.date, "ThirdlyUI_InputDate")}
                  value={dayjs(dateValue, { jalali: true })}
                  allowClear={false}
                  onChange={onDateChange}
                  {...restProps}
                />
              )}
            />
          )}
          {CustomElement && <CustomElement dateValue={dateValue} />}
        </div>

        {arrowChange && (
          <div className="ThirdlyUI_DateArrow" onClick={nextArrowClick}>
            <IconArrow2Right />
          </div>
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
