import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router";

// Components
import PageTemplate from "Components/PageTemplate";
import PageTitle from "Components/PageTemplate/PageTitle";
import { Button } from "Components/Button";
import ProductCard from "Components/Card/ProductCard";
import { NormalInput, FileInput, AsyncSelectInput } from "Components/Inputs";
import { ConfirmDeleteModal } from "Components/Modal";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";
import { ReactComponent as BackArrow } from "Assets/img/icons/back-arrow.svg";

// Services
import {
  addProductToMapApi,
  getProductsForFormApi,
  getMapProductsApi,
  removeProductFromMapApi,
  setImageForMapApi,
} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  leftSide: {
    "& > div": {
      marginBottom: 16,
    },
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 28,
  },
}));

export default function TechnicalMapForm() {
  const classes = useStyles();
  const history = useHistory();
  const methods = useForm();
  const { id } = useParams();
  const isEdit = id;

  const [loading, setLoading] = useState(false);
  const [mapImage, setMapImage] = useState(null);
  console.log("mapImage: ", mapImage);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteProductFromList = () => {
    setDeleteLoading(true);
    removeProductFromMapApi(showDeleteModal,id)
      .then(() => {
        setReload(!reload);
        setDeleteLoading(false);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setDeleteLoading(false);
      });
  };

  const initialPage = async () => {
    setLoading(true);
    const data = await getMapProductsApi(id);
    setProducts(data[0]?.products);
    setMapImage(data[0]?.image);
    setLoading(false);
  };

  useEffect(() => {
    // get data for edit page
    if (isEdit) {
      initialPage();
    }
  }, [reload]);

  const submitSetImage = async () => {
    setLoading(true);
    const body = { id, body: { image_id: mapImage?.id } };
    await setImageForMapApi(body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const submitAddProduct = async data => {
    setLoading(true);
    const body = { id, body: { ...data } };
    await addProductToMapApi(body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        methods.reset({ product_number_in_map: "" });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ConfirmDeleteModal
        title={`حذف محصول`}
        visible={!!showDeleteModal}
        onConfirm={deleteProductFromList}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
        text={`"آیا برای حذف کردن این محصول از لیست مطمئن هستید؟"`}
      />
      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <PageTemplate
            right={
              <Link to="/admin/category">
                <button className="transparent-button">
                  <BackArrow /> <span>بازگشت به لیست</span>
                </button>
              </Link>
            }
            center={<PageTitle>نقشه فنی</PageTitle>}
            left={<div />}
          >
            <Grid container direction="row" spacing={4}>
              <Grid item xs={12} sm={6}>
                <h3 className={classes.subTitle}>تصویر نقشه فنی</h3>
                <FileInput
                  setFile={setMapImage}
                  defaultValue={mapImage?.path}
                />
                <Button onClick={submitSetImage} width="100%">
            <AddIcon /> ثبت تصویر
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(submitAddProduct)}>
                    <h3 className={classes.subTitle}>
                      اضافه کردن محصول به نقشه
                    </h3>
                    <NormalInput
                      name="product_number_in_map"
                      label="شماره محصول در تصویر"
                      placeholder="شماره محصول را وارد کنید"
                    />
                    <AsyncSelectInput
                      name="product_id"
                      label="محصول"
                      placeholder="جستجو در محصولات"
                      shouldCheckValidDefault
                      isClearable
                      isMulti={false}
                      api={getProductsForFormApi}
                    />

                    <Button
                      background="transparent"
                      color="#F6891F"
                      iconColor="#F6891F"
                      width="100%"
                      type="submit"
                    >
                      <AddIcon /> افزودن محصول
                    </Button>
                  </form>
                </FormProvider>
              </Grid>
            </Grid>
          </PageTemplate>
          <PageTemplate
            right={<PageTitle> محصولات نقشه فنی</PageTitle>}
            center={<div />}
            left={<div />}
          >
            <Grid container direction="row" spacing={2}>
              {!loading && !products?.length && (
                <p className="text-center">محصولی به لیست اضافه نشده است</p>
              )}
              {products?.map(item => (
                <Grid key={item.id} item xs={12} sm={6}>
                  <ProductCard
                    product={item}
                    handleDelete={setShowDeleteModal}
                  />
                </Grid>
              ))}
            </Grid>
          </PageTemplate>
        </Spin>
      </div>
    </>
  );
}
