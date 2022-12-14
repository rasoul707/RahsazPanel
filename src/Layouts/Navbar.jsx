//Material
import {
  makeStyles,
  AppBar,
  Avatar,
  Hidden,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
//Styles
import navbarStyle from "Assets/jss/navbar.style";

const useStyles = makeStyles(navbarStyle);

export default function Navbar(props) {
  const classes = useStyles();

  const handle_title = prop => {
    if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
      return prop.name;
    }
    return null;
  };

  const title = props.routes.map(prop => {
    if (prop.path || typeof prop.path === "string") {
      return handle_title(prop);
    } else {
      return prop.routes.map(pr => handle_title(pr));
    }
  });

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
        {/* <div className={classes.navbar}>
          <div className="titleSide">
            <h2 className="pageTitle">{title}</h2>
            <span>Design Structure of App</span>
          </div>
          <div className="infoSide">
            <SettingSvgIcon />
            <MessageSvgIcon />
            <BellSvgIcon />
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </div>
        </div> */}
      </Toolbar>
    </AppBar>
  );
}
