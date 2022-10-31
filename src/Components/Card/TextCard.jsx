import { makeStyles } from "@material-ui/core/styles";
import { NAString } from "Utils/helperFunction";

const useStyles = makeStyles(theme => ({
  textCard: {
    marginBottom: 16,
    "& > div": {
      width: "100%",
      padding: "6px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      background: "#fafafa",
      borderRadius: 8,
      marginTop: 6,
    },
  },
}));

export default function TextCard({ label, text }) {
  const classes = useStyles();

  return (
    <div className={classes.textCard}>
      <p>{label}</p>
      <div>{NAString(text)}</div>
    </div>
  );
}
