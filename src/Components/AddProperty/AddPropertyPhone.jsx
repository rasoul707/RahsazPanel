import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput } from "Components/Inputs";

const useStyles = makeStyles(theme => ({}));

function AddPropertyPhone({ defaultValues }) {
  const classes = useStyles();

  return (
    <div>
      <AddPropertyFormContainer title="تلفن تماس">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="manager_office_phone"
              label="مدیر (دفتر)"
              placeholder="تلفن دفتر مدیر را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="manager_mobile_phone"
              label="مدیر (موبایل)"
              placeholder="تلفن موبایل مدیر را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="fax_number"
              label="شماره فکس"
              placeholder="شماره فکس را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="telecommunications_number"
              label="شماره مخابرات"
              placeholder="شماره مخابرات را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertyPhone;
