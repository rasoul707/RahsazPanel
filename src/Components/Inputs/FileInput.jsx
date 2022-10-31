import React from "react";
import clsx from "clsx";
import UploadFile from "Components/Uploader/UploadFile";
import InfoCard from "Components/Card/FileCard";
import { Player } from "video-react";
import { Button } from "Components/Button";

function FileInput({ label, classes, setFile, defaultValue, isVideo,onChange=()=>null }) {
  return (
    <div className={clsx(classes?.root, "ThirdlyUI_InputRoot")}>
      {label && (
        <label className={clsx(classes?.label, "ThirdlyUI_InputLabel")}>
          {label}
        </label>
      )}

      {defaultValue ? (
        isVideo ? (
          <>
            <Player
              src={`${process.env.REACT_APP_VIDEO_BASE_URL}${defaultValue?.path}`}
            />
            <Button
              width="100%"
              background="transparent"
              color="#ff0000"
              style={{ marginTop: "20px" }}
              onClick={() => setFile(null)}
            >
              حذف ویدئو
            </Button>
          </>
        ) : (
          <InfoCard
            item={{ path: defaultValue.path || defaultValue }}
            showInfo={false}
            setDelete={() => setFile(null)}
          />
        )
      ) : (
        <UploadFile onChange={onChange} setFile={setFile} forInput={true} isVideo={isVideo} />
      )}
    </div>
  );
}

export default FileInput;
