import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  infoCard: {
    width: "100%",
    padding: "30px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
    borderRadius: 8,
    "& svg": {
      width: 70,
      "& path":{
        fill:"#F6891F"
      }
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      marginLeft: 20,

      "& > strong": {
        fontSize: 22,
        fontWeight: 800,
      },

      "& > span": {
        fontSize: 14,
        fontWeight: 700,
      },
    },
  },
}));

export default function InfoCard({ icon, title, text }) {
  const classes = useStyles();

  return (
    <div className={classes.infoCard}>
      {icon}
      <div>
        <strong>{text}</strong>
        <span>{title}</span>
      </div>
    </div>
  );
}
