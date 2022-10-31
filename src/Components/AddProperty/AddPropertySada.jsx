import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput } from "Components/Inputs";

const useStyles = makeStyles(theme => ({}));

function AddPropertySada({ defaultValues }) {
  const classes = useStyles();

  return (
    <div>
      <AddPropertyFormContainer title="سادا">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="sada_submit_number"
              label="شماره ثبت سادا"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="sada_postcode"
              label="کدپستی ملک"
              placeholder="کد را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="Sada_tacking_code"
              label="کد رهگیری ملک"
              placeholder="کد را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <NormalInput
              name="sada_property_id"
              label="شناسه ملک"
              placeholder="شناسه را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <NormalInput
              name="sada_document_id"
              label="شناسه سند"
              placeholder="شناسه را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertySada;
