import React from "react";
import { makeStyles, Grid, Container } from "@material-ui/core";
import AddPropertyTitle from "./SubComponents/AddPropertyTitle";
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
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="city_name"
              label="شهرستان"
              placeholder="نام شهرستان را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="section_name"
              label="بخش"
              placeholder="نام بخش را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="dehestan_name"
              label="دهستان"
              placeholder="نام دهستان را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="rosta_name"
              label="روستا"
              placeholder="نام روستا را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="main_street_name"
              label="خیابان اصلی"
              placeholder="نام خیابان اصلی را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="second_street_name"
              label="خیابان فرعی"
              placeholder="نام خیابان فرعی را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="alley_name"
              label="کوچه"
              placeholder="نام کوچه را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="plaque_name"
              label="پلاک"
              placeholder="شماره پلاک را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="post_code_name"
              label="کد پستی"
              placeholder="کد پستی را وارد کنید"
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
