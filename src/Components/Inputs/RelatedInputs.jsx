import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useHandleForm from "./InputUtils/useHandleForm";
import SimpleSelect from "./InputUtils/SimpleSelect";
import clsx from "clsx";

export default function RelatedInputs({
  label,
  name,
  classes,
  showError,
  errorMessage,
  onChange,
  autoFindValue, // this will find defaultValue between options, defaultValue should only have value
  withoutControl,
  inputs,
  api,
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [options, setOptions] = useState([]);
  const [selectedID, setSelectedID] = useState(inputs[0]?.id);
  const [idForApiCall, setIdForApiCall] = useState(null);

  const getOptions = () => {
    api(idForApiCall)
      .then(data => {
        const isItemExist =
          options?.filter(item => item.id === selectedID)?.length > 0;

        let temp = [];
        if (isItemExist) {
          temp = options?.map(item =>
            item.id === selectedID ? { ...item, options: data } : item,
          );
        } else {
          temp = [...options, { id: selectedID, options: data }];
        }
        setOptions(temp);
      })
      .catch();
  };

  useEffect(() => {
    if (selectedID) {
      getOptions();
    }
  }, [selectedID, idForApiCall]);

  const onSelect = (value, nextInputId) => {
    setIdForApiCall(value);
    setSelectedID(nextInputId);
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
        {inputs?.map((input, index) => {
          const optionsFromApi = options?.filter(item => item.id == input.id)[0]
            ?.options;
          return (
            <SimpleSelect
              control={control}
              setValue={setValue}
              classes={classes}
              onChange={
                onChange ||
                (value => onSelect(value, inputs[index + 1]?.id || null))
              }
              withoutControl={withoutControl}
              autoFindValue={autoFindValue}
              {...restProps}
              name={input.name}
              placeholder={input.placeholder}
              options={
                input.options?.length ? input.options : optionsFromApi || []
              }
              defaultValue={input?.defaultValue}
            />
          );
        })}
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
