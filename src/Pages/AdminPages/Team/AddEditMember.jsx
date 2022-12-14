import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, Grid, Container } from "@material-ui/core";
import { Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button } from "Components/Button";
import { NormalInput, CheckboxInput } from "Components/Inputs";
import { ConfirmDeleteModal } from "Components/Modal";

// Assets
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import {
  getMemberOfMyTeamApi,
  addMemberToMyTeamApi,
  editMemberOfMyTeamApi,
  removeMemberApi,
  getMyTeamPermissionsApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
}));

export default function AddEditMember() {
  const classes = useStyles();
  const navigate = useNavigate();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteMember = () => {
    setDeleteLoading(true);
    removeMemberApi(showDeleteModal)
      .then(() => {
        setDeleteLoading(false);
        setShowDeleteModal(false);
        navigate("/admin/team");
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  const [name, setName] = useState(null);
  const initialPage = async () => {
    setLoading(true);
    const data = await getMemberOfMyTeamApi(id);
    setName(`${data.first_name} ${data.last_name}`);
    methods.reset(data);
    setLoading(false);
  };

  const [permissions, setPermissions] = useState([]);
  const getPermissions = async () => {
    setLoading(true);
    const data = await getMyTeamPermissionsApi(id);
    setPermissions(data?.permissions);
    setLoading(false);
  };

  useEffect(() => {
    getPermissions();
    // get data for edit page
    if (isEdit) {
      initialPage();
    }
  }, []);

  const onSubmit = async data => {
    setLoading(true);
    const api = isEdit ? editMemberOfMyTeamApi : addMemberToMyTeamApi;
    const body = isEdit ? { id, body: { ...data } } : { ...data };
    await api(body)
      .then(() => {
        setLoading(false);
        navigate("/admin/team");
      })
      .catch(() => {
        setLoading(false);
      });
    methods.reset(data);
  };

  return (
    <>
      <ConfirmDeleteModal
        title="?????? ??????"
        visible={!!showDeleteModal}
        onConfirm={deleteMember}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`?????? ???????? ?????? ???????? ?????? ?????? ?????????? ????????????`}
      />
      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <PageTemplate
                right={
                  <button className="transparent-button">
                    <BackArrow /> <span>???????????? ???? ????????</span>
                  </button>
                }
                center={isEdit ? <PageTitle>???????????? {name}</PageTitle> : <div />}
                left={<div style={{ width: "140px" }} />}
              >
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <NormalInput
                      name="first_name"
                      label="??????"
                      placeholder="?????? ???? ???????? ????????"
                      defaultValue=""
                    />
                    <NormalInput
                      name="phone_number"
                      type="number"
                      label="?????????? ??????????"
                      placeholder="?????????? ?????????? ???? ???????? ????????"
                      defaultValue=""
                    />
                    <NormalInput
                      name="role"
                      label="?????? ??????"
                      placeholder="?????? ?????? ???? ???????? ????????"
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NormalInput
                      name="last_name"
                      label="?????? ????????????????"
                      placeholder="?????? ???????????????? ???? ???????? ????????"
                      defaultValue=""
                    />
                    <NormalInput
                      name="email"
                      type="email"
                      label="??????????"
                      placeholder="?????????? ???? ???????? ????????"
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NormalInput
                      name="username"
                      label="?????? ????????????"
                      placeholder="?????? ???????????? ???? ???????? ????????"
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NormalInput
                      name="password"
                      type="password"
                      label="??????????????"
                      placeholder="?????????????? ???? ???????? ????????"
                      defaultValue=""
                    />
                  </Grid>
                </Grid>
                <Button type="submit">?????????? ??????????????</Button>
                {isEdit && (
                  <Button
                    type="button"
                    color="#FF0000"
                    background="transparent"
                    style={{ marginRight: "12px" }}
                    onClick={() => setShowDeleteModal(id)}
                  >
                    ?????? ??????
                  </Button>
                )}
              </PageTemplate>
              <PageTemplate
                right={<PageTitle>????????????????????? ??????</PageTitle>}
                center={<div />}
                left={<div />}
              >
                <Grid container direction="row" spacing={2}>
                  {permissions?.map(item => (
                    <Grid key={item.id} item xs={12} sm={3}>
                      <CheckboxInput
                        name={item.tag_id_en}
                        label={item.tag_id_fa}
                        defaultValue={item.user_access}
                      />
                    </Grid>
                  ))}
                </Grid>
              </PageTemplate>
            </form>
          </FormProvider>
        </Spin>
      </div>
    </>
  );
}
