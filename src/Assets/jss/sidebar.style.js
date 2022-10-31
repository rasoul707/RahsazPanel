import { drawerWidth } from "Utils/theme";

const sidebarStyle = theme => ({
  drawerPaper: {
    width: drawerWidth,
    border: "none",
    // position: "fixed",
    // top: "0",
    // bottom: "0",
    // left: "0",
    // zIndex: "1",
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "fixed",
      height: "100%",
      boxShadow: "none",
    },
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
      position: "fixed",
      // display: "block",
      // top: "0",
      // right: "0",
      // left: "auto",
      height: "100vh",
      zIndex: "1032",
      visibility: "visible",
      overflowY: "visible",
      borderTop: "none",
      textAlign: "left",
      paddingRight: "0px",
      paddingLeft: "0",
      transform: `translate3d(${drawerWidth}px, 0, 0)`,
      ...theme.transition,
    },
  },
  logoWrapper: {
    padding: "20px 57px",
    borderBottom: "1px solid #EBEBEB",
    marginBottom: 14,
    "& > img": {
      width: "100%",
    },
  },
  sidebarWrapper: {
    position: "relative",
    // height: "calc(100vh - 75px)",
    overflow: "auto",
    width: "260px",
    zIndex: "4",
    overflowScrolling: "touch",
  },
  logoutButton: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // margin: "auto",
    // bottom: 16,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding:"5px 15px",
    gap: 5,
    // justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    "& path": {
      fill: "#ff0000",
    },
  },
  list: {
    marginTop: "20px",
    paddingLeft: "0",
    paddingTop: "0",
    paddingBottom: "0",
    marginBottom: "0",
    listStyle: "none",
    position: "unset",
    // "& .MuiCollapse-entered": {
    "& .MuiCollapse-wrapperInner": {
      "& .MuiListItem-root": {
        marginLeft: 35,
      },
    },
  },
});

export default sidebarStyle;
