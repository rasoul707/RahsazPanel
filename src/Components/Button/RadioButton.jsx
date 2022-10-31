import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  buttonWrapper: {
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    background: "#F4F4F5",
    padding: 6,
    "& button": {
      margin: "1px 0",
      fontWeight: 400,
      fontSize: 14,
      borderRadius: 8,
      flexGrow: 1,
      background: "transparent",

      "&:first-child": {
        borderRadius: "3px 0 0 3px",
        paddingLeft: 3,
      },
      "&:last-child": {
        borderRadius: "0 3px 3px 0",
        paddingRight: 3,
      },

      "&>span": {
        padding: "7px 16px",
        cursor: "pointer",
        transition: ".3s",
        display: "block",
        borderRadius: 8,
      },
    },
    "& button.activeButton>span": {
      background: "#151515",
      color: "#fff",
    },
  },
}));

export default function RadioButton({ buttons, active, setActive, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.buttonWrapper, "fit-width", className)}>
      {buttons.map(button => (
        <button
          key={button.value}
          className={clsx(active === button.value && "activeButton")}
          onClick={() => setActive(button.value, button)}
          type="button"
        >
          <span
            style={{
              background:
                active === button.value ? button.activeBackground : "",
            }}
          >
            {button.label}
          </span>
        </button>
      ))}
    </div>
  );
}

