import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput } from "Components/Inputs";

const useStyles = makeStyles(theme => ({}));

function AddPropertyCoordinates({ defaultValues }) {
  const classes = useStyles();

  return (
    <div>
      <AddPropertyFormContainer title="مختصات UTM مرکز ملک">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="coordinate_x"
              label="عرض جغرافیایی X"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="coordinate_y"
              label="طول جغرافیایی Y"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="coordinate_lambda"
              label="عرض جغرافیایی λ"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="coordinate_q"
              label="طول جغرافیایی Q"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertyCoordinates;
