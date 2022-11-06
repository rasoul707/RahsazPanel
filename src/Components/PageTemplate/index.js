
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(theme => ({
  pageTemplateWrapper: {
    background: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
  },
  header: {
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seprator: {
    width: "100%",
    height: 1,
    background: "#EBEBEB",
  },
  content: {
    padding: "32px 32px 45px",
  },
  minPaddingContent: {
    padding: "24px 16px",
  },
}));

export default function PageTemplate({
  right,
  center,
  left,
  children,
  minPadding,
}) {
  const classes = useStyles();

  return (
    <div className={classes.pageTemplateWrapper}>
      <div className={classes.header}>
        {right}
        {center}
        {left}
      </div>
      <div className={classes.seprator} />
      <div className={minPadding ? classes.minPaddingContent : classes.content}>
        {children}
      </div>
    </div>
  );
}
