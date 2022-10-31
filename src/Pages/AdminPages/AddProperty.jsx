import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

// steps
import {
  AddPropertyAddress,
  AddPropertyPhone,
  AddPropertyLegal,
  AddPropertySada,
  AddPropertyCoordinates,
  AddPropertyCurrentUser,
} from "Components/AddProperty";

export default function AddProperty({ defaultValue }) {
  // initial form
  const methods = useForm();
  const [defaultValues] = useState({ ...defaultValue });
  const onSubmit = data => console.log(data);

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AddPropertyAddress defaultValues={defaultValues} />{" "}
          <AddPropertyPhone defaultValues={defaultValues} />
          <AddPropertyLegal defaultValues={defaultValues} />
          <AddPropertySada defaultValues={defaultValues} />
          <AddPropertyCoordinates defaultValues={defaultValues} />
          <AddPropertyCurrentUser defaultValues={defaultValues} />
        </form>
      </FormProvider>
    </div>
  );
}
