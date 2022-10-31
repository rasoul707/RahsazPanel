import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: 12,
  },
}));
function AddPropertyTitle({ children }) {
  const classes = useStyles();
  return <h3 className={classes.title}>{children}</h3>;
}

export default AddPropertyTitle;
