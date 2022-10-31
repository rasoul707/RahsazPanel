import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    background: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,

    "& > header": {
      fontSize: 18,
      fontWeight: 600,
      borderBottom: "1px solid #eeeeee",
      "& > span": {
        padding: "10px 20px",
        display: "block",
      },
    },
  },
  content: {
    padding: "20px",

    "& > h4": {
      marginBottom: 16,
      color: "#555",
    },
  },
}));
function AddPropertyTitle({ title, children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <header>
        <span>{title}</span>
      </header>
      <div className={classes.content}>{children}</div>
    </div>
  );
}

export default AddPropertyTitle;
