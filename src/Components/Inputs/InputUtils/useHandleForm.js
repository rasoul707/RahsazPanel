import { useFormContext } from "react-hook-form";

const mockMethods = {
  clearErrors: () => {},
  control: {},
  errors: {},
  formState: {},
  getValues: () => {},
  handleSubmit: () => {},
  register: () => {},
  reset: () => {},
  setError: () => {},
  setValue: () => {},
  trigger: () => {},
  unregister: () => {},
  watch: () => {},
};

export default function useHandleForm(withoutControl) {
  const methods = useFormContext();

  if (withoutControl) {
    return mockMethods;
  } else {
    if (!methods) {
      throw new Error(
        "methods can not be null, wrap input with FormProvider or set withoutControl on input",
      );
    }
    if (!Object.keys(methods).length) {
      throw new Error("FormProvider methods can not be empty");
    }
    return methods;
  }
}
