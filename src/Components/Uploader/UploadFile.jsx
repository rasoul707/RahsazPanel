import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Upload } from "antd";
import clsx from "clsx";

// Components
import { LibraryModal } from "Components/Modal";

// Assets
import { ReactComponent as UploadImageIcon } from "Assets/img/icons/upload-image.svg";

// Services
import { uploadFileInLibraryApi, uploadVideoInLibraryApi } from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {
    "& .ant-upload-drag": {
      padding: ({ forInput }) => (forInput ? 12 : 42),
    },
  },
  libraryButton: {
    display: "block",
    margin: "0px auto",
    padding: "5px 0",
  },
}));
const { Dragger } = Upload;
export default function UploadFile({
  setFile,
  forInput,
  showLibraryButton = true,
  isMulti = false,
  isVideo = false,
  onChange=()=>null
}) {
  const classes = useStyles({ forInput });

  const [loading, setLoading] = useState(false);

  const [showLibraryModal, setShowLibraryModal] = useState(false);

  const initialPage = async () => {
    setLoading(true);
    // const data = await initialDashboardPageApi();
    setLoading(false);
  };

  useEffect(() => {
    // get data for initial page
    initialPage();
  }, []);

  const handleOnChange = info => {
    const file = info.file;
    console.log('fileee',file);
    let formData = new FormData();
    formData.append(isVideo ? "video" : "image", file);
    (isVideo ? uploadVideoInLibraryApi : uploadFileInLibraryApi)(formData)
      .then(data => {
        if (setFile) setFile({ id: data?.id, path: data?.path });
        info.onSuccess();
      })
      .catch(() => {
        info.onError();
      });
  };

  const openLibrary = e => {
    e.stopPropagation();
    setShowLibraryModal(true);
  };

  return (
    <>
      {showLibraryModal && (
        <LibraryModal
          visible={showLibraryModal}
          onCancel={() => setShowLibraryModal(false)}
          files={[]}
          setFiles={files => (isMulti ? setFile(files) : setFile(files[0]))}
          isMulti={isMulti}
        />
      )}
      <div className={classes.wrapper}>
        <Spin spinning={loading}>
          <Dragger
            multiple={true}
            customRequest={handleOnChange}
            showUploadList={{ showRemoveIcon: false }}
            accept={isVideo ? "video/*" : "image/*"}
            onChange={onChange}
          >
            <UploadImageIcon />
            <p>فایل خود را انتخاب کنید</p>
            {showLibraryButton && !isVideo && (
              <button
                className={clsx(
                  classes.libraryButton,
                  "transparent-button color-link",
                )}
                type="button"
                onClick={openLibrary}
              >
                یا از کتابخانه انتخاب کنید
              </button>
            )}
          </Dragger>
        </Spin>
      </div>
    </>
  );
}
