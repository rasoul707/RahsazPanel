import React, { useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput, SelectInput } from "Components/Inputs";
// import AddFile from "Components/Uploader/AddFile";

const useStyles = makeStyles(theme => ({}));

function AddPropertyCurrentUser({ defaultValues }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  return (
    <div>
      <AddPropertyFormContainer title="کاربری فعلی ملک">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={4}>
            <SelectInput
              name="current_user_type"
              label="نوع کاربری فعلی ملک"
              placeholder="نوع سند را انتخاب کنید"
              options={[
                { label: "اداری", value: "official" },
                { label: "تجاری", value: "commercial" },
                { label: "مسکونی", value: "residential" },
                { label: "انبار", value: "store" },
                { label: "تعمیرگاه", value: "repair_shop" },
                { label: "سرایداری", value: "caretaker" },
                { label: "آموزشی", value: "educational" },
                { label: "کشاورزی", value: "agriculture" },
                { label: "صنعتی", value: "industrial" },
                { label: "خدماتی", value: "services" },
                { label: "سایر", value: "other" },
              ]}
              rules={{ required: true }}
              shouldCheckValidDefault
              defaultValue={{
                label: defaultValues.current_user_type,
                value: defaultValues.current_user_type,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="current_user_type_description"
              label="توضیحات"
              placeholder="توضیحات را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.current_user_type_description}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            <NormalInput
              name="current_user_open_roof_parking_number"
              label="پارکینگ مسقف"
              placeholder="تعداد"
              rules={{ required: true }}
              defaultValue={defaultValues.current_user_open_roof_parking_number}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            <NormalInput
              name="current_user_with_roof_parking_number"
              label="پارکینگ روباز"
              placeholder="تعداد"
              rules={{ required: true }}
              defaultValue={defaultValues.current_user_with_roof_parking_number}
            />
          </Grid>
        </Grid>
        {/* <AddFile
          filesUploadApi={() => {}}
          onChange={result => {
            setFiles(result);
          }}
          defaultFiles={defaultValues.file_names}
          hideTypesTip={true}
          label="بارگزاری نامه استعلام کاربری"
        /> */}
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertyCurrentUser;
