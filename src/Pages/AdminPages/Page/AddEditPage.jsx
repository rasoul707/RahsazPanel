import { Grid, makeStyles } from "@material-ui/core";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

// Components
import { Button } from "Components/Button";
import {
  NormalInput, TextareaInput
} from "Components/Inputs";
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
// import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import { addPageApi, editPageApi, getSinglePageApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
  addCategoryBtn: {
    color: "#1F75F6",
    "& path": {
      fill: "#1F75F6",
    },
  },
  subtitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
  },
  similarProductItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  delete: {
    background: "#FF000010",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    cursor: "pointer",
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;
  const [defaultValues, setDefaultValues] = useState({});
  const [contentState, setcontentState] = useState('');
  const [loading, setLoading] = useState(false);


  const initialPage = async () => {
    setLoading(true);
    const data = await getSinglePageApi(id);
    setDefaultValues(data);
    methods.reset(data);
    setLoading(false);
  };


  useEffect(() => {
    // getCurrenciesList();
    // get data for initial page
    if (isEdit) {
      initialPage();
    }
  }, []);

  const onSubmit = async formData => {
    const lastFormData = {
      ...formData,
    };
    const body = {
      ...lastFormData,
    };

    const data = isEdit ? { id, body } : body;
    setLoading(true);
    await (isEdit ? editPageApi : addPageApi)(data)
      .then(() => {
        navigate("/admin/page");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>

      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12} sm={8}>
                  <PageTemplate
                    right={
                      <button
                        onClick={() => navigate("/admin/page")}
                        className="transparent-button"
                      >
                        <BackArrow /> <span>???????????? ???? ????????</span>
                      </button>
                    }
                    center={
                      <PageTitle>
                        {isEdit ? "???????????? ????????" : "???????????? ???????? ????????"}
                      </PageTitle>
                    }
                    left={<div style={{ width: "140px" }} />}
                  >
                    <NormalInput
                      name="name"
                      label="?????? ????????"
                      placeholder="?????? ???????? ???? ???????? ????????"
                    />
                    <NormalInput
                      name="tag_en"
                      label="???????? ??????????"
                      placeholder="???????? ?????????? ???? ???????? ????????"
                    />
                    <TextareaInput
                      name="content"
                      label="??????"
                      placeholder="?????? ???? ???????? ????????"
                    />
                  </PageTemplate>
                </Grid>
                <Grid className={classes.leftSide} item xs={12} sm={4}>
                  <PageTemplate
                    right={<PageTitle>???????????? ????????</PageTitle>}
                    center={<div />}
                    left={<div />}
                    minPadding
                  >

                    <Button
                      width="100%"
                      type="submit"
                      style={{ marginTop: "20px" }}
                    >
                      {isEdit ? "???????????? ????????" : "?????????? ???????? ????????"}
                    </Button>
                  </PageTemplate>


                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Spin>
      </div>
    </>
  );
}
