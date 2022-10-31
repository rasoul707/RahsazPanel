import { Menu, Dropdown } from "antd";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  dropdown: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 4,
    border: "1px solid #EBEBEB",
    background: "transparent",
  },
  menu: {
    padding: "6px 0px !important",
    boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.04)",
    borderRadius: 8,
    "& .ant-dropdown-menu-title-content": {
      "& > button": {
        display: "flex",
        alignItems: "center",
        background: "transparent",
        cursor: "pointer",
      },
    },
  },
}));

export default function LoginPage({ children, items }) {
  const classes = useStyles();

  const menu = (
    <Menu className={classes.menu}>
      {items?.map((item, index) => (
        <Menu.Item key={index}>{item}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown className={classes.dropdown} overlay={menu} trigger={["click"]}>
      {children}
    </Dropdown>
  );
}
