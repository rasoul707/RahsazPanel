//Material
import { Hidden, List, Drawer, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
//Styles
import sidebarStyle from "Assets/jss/sidebar.style";
// helper function
import MenuItem from "./MenuItem";
import { routeWithFaName } from "Utils/helperFunction";

// redux
import { useDispatch, useSelector } from "react-redux";
import { logout } from "Store/_actions/auth.action";

//Assets
import Logo from "Assets/img/logo.png";
import { ReactComponent as LogoutIcon } from "Assets/img/icons/logout.svg";

const useStyles = makeStyles(sidebarStyle);

export default function SideBar(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state?.auth);
  let routes = routeWithFaName(user?.user_permissions);
  const handleLogout = async e => {
    e.preventDefault();
    try {
      await dispatch(logout());
      history.replace("/auth/login");
    } catch (err) {
      console.log("err Logout from_____", err);
    }
  };
  const links = (
    <List className={classes.list}>
      {props.routes
        .filter(item => item.showInMenu)
        .map((item, index) => {
          if (routes?.includes(item?.path)) {
            return (
              <MenuItem
                {...item}
                key={index}
                handleDrawerToggle={props.handleDrawerToggle}
              />
            );
          }
        })}
    </List>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"left"}
          open={props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.logoWrapper}>
            <img src={Logo} alt="" />
          </div>
          <div className={classes.sidebarWrapper}>
            {links}
            <button
              className={clsx(
                classes?.logoutButton,
                "transparent-button color-error",
              )}
              onClick={handleLogout}
            >
              <LogoutIcon />
              خروج از داشبورد
            </button>
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          anchor={"left"}
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.logoWrapper}>
            <img src={Logo} alt="" />
          </div>
          <div className={classes.sidebarWrapper}>
            {links}
            <button
              className={clsx(
                classes?.logoutButton,
                "transparent-button color-error",
              )}
              onClick={handleLogout}
            >
              <LogoutIcon />
              خروج از داشبورد
            </button>
          </div>
        </Drawer>
      </Hidden>
    </div>
  );
}
