import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// Assets
import { ReactComponent as MoreIcon } from "Assets/img/icons/more.svg";

const useStyles = makeStyles(theme => ({
  moreButton: {
    cursor: "pointer",
    border: "1px solid #EBEBEB",
    borderRadius: 4,
    padding: 8,
    background: "transparent",
  },
}));

export default function MoreButton({ ...props }) {
  const classes = useStyles();

  return (
    <button className={classes.moreButton} {...props}>
      <MoreIcon />
    </button>
  );
}
