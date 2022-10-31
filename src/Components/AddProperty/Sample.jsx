import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput } from "Components/Inputs";

const useStyles = makeStyles(theme => ({}));

function AddPropertyAddress({ defaultValues }) {
  const classes = useStyles();

  return (
    <div>
      <AddPropertyFormContainer title="آدرس">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="country_name"
              label="استان"
              placeholder="نام استان را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertyAddress;
