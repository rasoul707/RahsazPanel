import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import clsx from "clsx";

// Assets
import { ReactComponent as InfoIcon } from "Assets/img/icons/info.svg";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

const useStyles = makeStyles(theme => ({
  fileCard: {
    paddingBottom: "100%",
    display: "block",
    position: "relative",
    background: "#C4C4C4",
    borderRadius: 8,
    "& > button": {
      position: "absolute",
      top: 10,
      background: "#FFFFFF",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 36,
      width: 36,
      cursor: "pointer",
    },
  },
  active: {
    boxShadow: "0px 0px 10px 2px rgba(246,137,31,1)",
  },
  media: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%", //auto
    objectFit: "fill",
    borderRadius: 8,
  },
  edit: {
    left: 50,
  },
  delete: {
    left: 14,
  },
}));

export default function InfoCard({
  item,
  setDelete,
  setEdit,
  showInfo = true,
  showDelete = true,
  onClick = () => {},
  selectedFiles = [],
  leftIcon,
}) {
  const classes = useStyles();
  const active = selectedFiles?.map(item => item.id)?.includes(item?.id);
  return (
    <div className={clsx(classes.fileCard, active && classes.active)}>
      <CardMedia
        component={"img"}
        style={{ cursor: onClick && "pointer" }}
        className={classes.media}
        src={`${process.env.REACT_APP_FILE_BASE_URL}${item?.path}`}
        onClick={() => onClick(item)}
      />
      {showInfo && (
        <button
          type="button"
          onClick={() => setEdit(item)}
          className={classes.edit}
        >
          {leftIcon || <InfoIcon />}
        </button>
      )}

      {showDelete && (
        <button
          type="button"
          onClick={() => setDelete(item?.id)}
          className={classes.delete}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}
