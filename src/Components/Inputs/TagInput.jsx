import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import useHandleForm from "./InputUtils/useHandleForm";
import clsx from "clsx";
import ReactTagInput from "@pathofdev/react-tag-input";
import { TAG_REGEX } from "Utils/regex";

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
  ...restProps
}) {
  const { control, errors, setValue } = useHandleForm(withoutControl);

  const [localError, setLocalError] = useState("");
  const [tags, setTags] = useState([]);

  // handle change default value
  useEffect(() => {
    if (defaultValue && Array.isArray(defaultValue)) {
      console.log("defaultValue: ", defaultValue);
      setTags(defaultValue);
      setValue(name, defaultValue);
    }
  }, [JSON.stringify(defaultValue)]);

  const onTagChange = newTags => {
    if (onChange) onChange(newTags);
    setTags(newTags);
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
            <ReactTagInput
              tags={tags}
              onChange={onTagChange}
              editable={true}
              removeOnBackspace={true}
              // validator={value => {
              //   if (!TAG_REGEX.test(value)) {
              //     setLocalError("Tags can only contain letters and _");
              //     return false;
              //   } else {
              //     setLocalError("");
              //     return true;
              //   }
              // }}
              {...restProps}
            />
          ) : (
            <Controller
              control={control}
              name={name}
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
                <ReactTagInput
                  tags={tags}
                  onChange={newTags => {
                    props.onChange(newTags);
                    onTagChange(newTags);
                  }}
                  editable={true}
                  removeOnBackspace={true}
                  // validator={value => {
                  //   if (!TAG_REGEX.test(value)) {
                  //     setLocalError("Tags can only contain letters and _");
                  //     return false;
                  //   } else {
                  //     setLocalError("");
                  //     return true;
                  //   }
                  // }}
                  {...restProps}
                />
              )}
            />
          )}
        </div>
      </div>
      <div style={{ fontSize: "10px", marginTop: "4px", color: "#616161" }}>
        بعد افزودن هر مورد کلید اینتر را فشار دهید
      </div>
      <div className={clsx(classes?.error, "ThirdlyUI_InputErrorMessage")}>
        {(localError || showError || errors.hasOwnProperty(name)) && (
          <span>
            {localError ||
              errorMessage ||
              errors[name]?.message ||
              "Please fill out the field"}
          </span>
        )}
      </div>
    </div>
  );
}
