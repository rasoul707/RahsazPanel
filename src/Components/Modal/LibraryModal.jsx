import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";

// Components
import UploadFile from "Components/Uploader/UploadFile";
import PageTemplate from "Components/PageTemplate";
import Table from "Components/Table";
import { Button } from "Components/Button";
import FileCard from "Components/Card/FileCard";

// Assets
import { ReactComponent as AddIcon } from "Assets/img/icons/add.svg";

// Services
import { getLibraryDataApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
}));

export default function LibraryModal({
  visible,
  onCancel,
  files,
  setFiles,
  isMulti,
}) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [step, setStep] = useState(1);

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (files) {
      setSelectedFiles(files);
    }
  }, []);

  const addOrRemoveFile = item => {
    if (isMulti) {
      if (selectedFiles?.includes(item)) {
        setSelectedFiles(selectedFiles?.filter(file => file !== item));
      } else {
        setSelectedFiles([...selectedFiles, item]);
      }
    } else {
      setSelectedFiles([item]);
    }
  };

  const onConfirm = () => {
    setFiles(selectedFiles);
    onCancel();
  };

  return (
    <Modal
      title="کتابخانه"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      cancelText="لغو"
      okText="ذخیره"
      width="800px"
      okButtonProps={{
        style: { background: "#F6891F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        {step === 1 && (
          <PageTemplate
            right={<div />}
            center={<div />}
            left={
              <Button
                onClick={() => {
                  setStep(2);
                }}
              >
                <AddIcon /> افزودن تصویر جدید
              </Button>
            }
          >
            <Table
              title="تصویر"
              api={getLibraryDataApi}
              reload={reload}
              card={{
                component: FileCard,
                gridProps: { xs: 12, sm: 3, md: 2 },
                cardProps: {
                  showDelete: false,
                  showInfo: false,
                  selectedFiles: selectedFiles,
                  onClick: addOrRemoveFile,
                },
              }}
            />
          </PageTemplate>
        )}
        {step === 2 && (
          <PageTemplate
            right={<div />}
            center={<div />}
            left={
              <Button
                onClick={() => {
                  setStep(1);
                }}
              >
                بازگشت به انتخاب تصاویر
              </Button>
            }
          >
            <UploadFile />
          </PageTemplate>
        )}
      </Spin>
    </Modal>
  );
}
