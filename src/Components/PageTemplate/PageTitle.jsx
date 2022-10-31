import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  pageTitle: {
    color: "#333333",
    fontSize: 18,
    fontWeight: 700,
  },
}));

export default function PageTitle({ children }) {
  const classes = useStyles();

  return <h3 className={classes.pageTitle}>{children}</h3>;
}
