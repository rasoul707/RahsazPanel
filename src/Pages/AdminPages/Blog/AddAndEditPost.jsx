import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button } from "Components/Button";
import {
  NormalInput,
  CheckboxInput,
  TextareaInput,
  AsyncSelectInput,
  TagInput,
  FileInput,
} from "Components/Inputs";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import {
  getUsersForFormApi,
  getMyTeamForFormApi,
  addBlogPostApi,
  updateBlogPostApi,
  getSingleBlogPostApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
}));

export default function AddEditBolgPost() {
  const classes = useStyles();
  const navigate = useNavigate();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;

  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [postHasVideo, setPostHasVideo] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [video, setVideo] = useState("");
  console.log("def", defaultValues);

  const initialPage = async () => {
    setLoading(true);
    const data = await getSingleBlogPostApi(id);
    setDefaultValues(data);
    methods.reset(data);
    setPostHasVideo(data?.has_educational_video);
    if (data?.image?.id) {
      setCoverImage({
        id: data?.image?.id,
        path: data?.image?.path,
      });
    }
    if (data?.video_link) {
      setVideo({
        id: data?.video_link,
        path: data?.video_link,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    if (isEdit) {
      initialPage();
    }
  }, []);

  const onSubmit = async (formData, status) => {
    console.log("formData", formData, status);
    const tags = formData?.tags?.[0]?.id
      ? formData?.tags?.map(item => item?.title)
      : formData?.tags;
    const body = {
      status,
      image_id: coverImage?.id,
      video_link: video.path,
      ...formData,
      tags,
    };

    const data = isEdit ? { id, body } : body;
    const api = isEdit ? updateBlogPostApi : addBlogPostApi;

    setLoading(true);
    await api(data)
      .then(() => {
        navigate("/admin/blog");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={classes.wrapper}>
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} sm={8}>
                <PageTemplate
                  right={
                    <button
                      className="transparent-button"
                      onClick={() => navigate(`/admin/blog`)}
                    >
                      <BackArrow /> <span>بازگشت به نوشته‌ها</span>
                    </button>
                  }
                  center={<PageTitle>اطلاعات نوشته</PageTitle>}
                  left={<div style={{ width: "140px" }} />}
                >
                  <NormalInput
                    name="title"
                    label="عنوان نوشته"
                    placeholder="عنوان نوشته را وارد کنید"
                  />
                  <CheckboxInput
                    name="has_educational_video"
                    label="این نوشته شامل ویدئو آموزشی است"
                    defaultValue={defaultValues?.has_educational_video || 0}
                    onClick={e => setPostHasVideo(e.target.checked)}
                  />
                  {postHasVideo && (
                    <>
                      {/* <NormalInput
                        name="video_link"
                        label="لینک ویدئو"
                        placeholder="لینک ویدئو را وارد کنید"
                      /> */}
                      <FileInput
                        setFile={setVideo}
                        defaultValue={video}
                        isVideo={true}
                      />
                    </>
                  )}
                  <hr style={{ margin: "12px 0" }} />
                  <TextareaInput
                    name="description"
                    label="متن نوشته"
                    placeholder="متن را وارد کنید"
                    rows={18}
                  />
                </PageTemplate>
              </Grid>
              <Grid className={classes.leftSide} item xs={12} sm={4}>
                <PageTemplate
                  right={<PageTitle>انتشار نوشته</PageTitle>}
                  center={<div />}
                  left={<div />}
                  minPadding
                >
                  <AsyncSelectInput
                    name="written_by_user_id"
                    label="نویسنده"
                    placeholder="جستجو برای اعضای تیم"
                    shouldCheckValidDefault
                    isClearable
                    api={getMyTeamForFormApi}
                    defaultValue={
                      defaultValues?.writer?.id && {
                        label: `${defaultValues?.writer?.first_name} ${defaultValues?.writer?.last_name}`,
                        value: defaultValues?.writer?.id,
                      }
                    }
                  />
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        width="100%"
                        background="transparent"
                        color="#1F75F6"
                        style={{ marginTop: "20px" }}
                        onClick={() =>
                          methods.handleSubmit(onSubmit)("scheduled")
                        }
                      >
                        ذخیره پیش نویس
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        width="100%"
                        style={{ marginTop: "20px" }}
                        onClick={() =>
                          methods.handleSubmit(onSubmit)("published")
                        }
                      >
                        انتشار نوشته
                      </Button>
                    </Grid>
                  </Grid>
                </PageTemplate>
                <PageTemplate
                  right={<PageTitle>تصویر نوشته</PageTitle>}
                  center={<div />}
                  left={<div />}
                  minPadding
                >
                  <FileInput
                    setFile={setCoverImage}
                    defaultValue={coverImage}
                  />
                </PageTemplate>
                <PageTemplate
                  right={<PageTitle>برچسب‌ها</PageTitle>}
                  center={<div />}
                  left={<div />}
                  minPadding
                >
                  <TagInput
                    name="tags"
                    label="برچسب"
                    placeholder="افزودن"
                    defaultValue={defaultValues?.tags?.map(item => item?.title)}
                  />
                </PageTemplate>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Spin>
    </div>
  );
}
