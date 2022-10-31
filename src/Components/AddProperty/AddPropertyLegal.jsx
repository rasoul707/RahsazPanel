import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import AddPropertyFormContainer from "./SubComponents/AddPropertyFormContainer";

import { NormalInput, SelectInput } from "Components/Inputs";

const useStyles = makeStyles(theme => ({}));

function AddPropertyLegal({ defaultValues }) {
  const classes = useStyles();

  return (
    <div>
      <AddPropertyFormContainer title="حقوقی">
        <h4>- اطلاعات سند مالکیت</h4>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={4}>
            <SelectInput
              name="document_type"
              label="نوع سند"
              placeholder="نوع سند را انتخاب کنید"
              options={[
                { label: "فاقد سند", value: "Internship" },
                { label: "سند عادی", value: "Entry level" },
                { label: "سند دفترچه ای", value: "Associate" },
                { label: "سند تک برگ معمولی", value: "Mid-Senior level" },
                { label: "سند تک برگ دولتی", value: "Director" },
                { label: "سند شش دنگ", value: "Executive" },
                { label: "سند مشاعی", value: "Not Applicable" },
              ]}
              rules={{ required: true }}
              shouldCheckValidDefault
              defaultValue={{
                label: defaultValues.document_type,
                value: defaultValues.document_type,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="mahsaie_value"
              label="مقدار مشاعی "
              placeholder="در صورت مشاعی بودن سند"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="owner_in_document"
              label="نام مالک مندرج در سند"
              placeholder="نام را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <NormalInput
              name="used_by_in_document"
              label="نام دستگاه بهره بردار مندرج سند"
              placeholder="نام را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <NormalInput
              name="used_by_now"
              label="نام دستگاه بهره بردار فعلی"
              placeholder="نام را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>

        <h4>- پلاک بتنی</h4>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="sub_plaque"
              label="فرعی"
              placeholder="پلاک را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="from_main_plaque"
              label="از اصلی"
              placeholder="پلاک را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="submited_section_plaque"
              label="بخش ثبتی"
              placeholder="پلاک را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <NormalInput
              name="submited_area_plaque"
              label="ناحیه ثبتی"
              placeholder="پلاک را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="number_of_owner_notebook"
              label="شماره دفترچه مالکیت"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="number_of_normal_single_leaf"
              label="شماره تکبرگ معمولی"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <NormalInput
              name="number_of_governmental_single_leaf"
              label="شماره تکبرگ دولتی"
              placeholder="شماره را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>

        <h4>- ملاحظات سند</h4>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6} sm={6} md={3}>
            <SelectInput
              name="document_considerations_type"
              label="ملاحظات سند"
              placeholder="نوع ملاحظات سند را انتخاب کنید"
              options={[
                { label: "بازداشتی", value: "Internship" },
                { label: "عرصه وقفی", value: "Entry level" },
                { label: "در رهن بانک", value: "Associate" },
                { label: "سایر", value: "Mid-Senior level" },
              ]}
              rules={{ required: true }}
              shouldCheckValidDefault
              defaultValue={{
                label: defaultValues.document_considerations_type,
                value: defaultValues.document_considerations_type,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={9}>
            <NormalInput
              name="document_considerations_description"
              label="توضیحات"
              placeholder="توضیحات را وارد کنید"
              rules={{ required: true }}
              defaultValue={defaultValues.first_name}
            />
          </Grid>
        </Grid>
      </AddPropertyFormContainer>
    </div>
  );
}

export default AddPropertyLegal;
