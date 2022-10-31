const navbarStyle = theme => ({
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "0",
    marginBottom: "0",
    position: "absolute",
    width: "100%",
    paddingTop: "10px",
    zIndex: "-122",
    border: "0",
    borderRadius: "3px",
    padding: "10px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block",
  },
  container: {
    ...theme.container,
    minHeight: "50px",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    "& .titleSide": { flexBasis: "80%" },
    "& .infoSide": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexBasis: "20%",
    },
    "& .pageTitle": {
      fontSize: 22,
      fontWeight: 800,
      color: "#333333",
      margin: 0,
    },
  },
});

export default navbarStyle;
