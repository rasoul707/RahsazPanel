import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";
import Button from "@material-ui/core/Button";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  root: {
    padding: props => props.padding,
    background: props => props.background,
    width: props => props.width,
    color: props => props.color,
    border: props =>
      props.border || `1px solid ${props.borderColor || props.color}`,
    fontSize: 14,
    fontWeight: 400,
    borderRadius: 8,
    fontFamily: "'Iran Yekan', sans-serif",
    "& path": {
      fill: props => props.iconColor,
    },

    "&:hover": {
      background: props => props.background,
    },

    minWidth: "auto",
  },
}));

export default function PrimaryButton({
  className,
  children,
  background = "#F6891F",
  padding = "9px 16px",
  width = "auto",
  color = "#FFFFFF",
  iconColor = "#FFFFFF",
  borderColor,
  border,
  loading,
  ...restProps
}) {
  const classes = useStyles({
    background,
    padding,
    width,
    color,
    borderColor,
    iconColor,
    border,
  });

  return (
    <Button
      variant="text"
      className={clsx(classes.root, className)}
      {...restProps}
    >
      {loading ? <Spin size="small" spinning={loading} /> : children}
    </Button>
  );
}
