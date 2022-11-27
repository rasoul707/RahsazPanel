// pages
import Dashboard from "Pages/AdminPages/Dashboard";
import Blog from "Pages/AdminPages/Blog";
import AddAndEditPost from "Pages/AdminPages/Blog/AddAndEditPost";
import Library from "Pages/AdminPages/Library";
import Comment from "Pages/AdminPages/Comment";
import Team from "Pages/AdminPages/Team";
import AddEditMember from "Pages/AdminPages/Team/AddEditMember";
import Coupon from "Pages/AdminPages/Coupon";
import AddEditCoupon from "Pages/AdminPages/Coupon/AddEditCoupon";
import AddEditPage from "Pages/AdminPages/Page/AddEditPage";
import Page from "Pages/AdminPages/Page";

import ViewCoupon from "Pages/AdminPages/Coupon/ViewCoupon";
import Category from "Pages/AdminPages/Category";
import Orders from "Pages/AdminPages/Orders";

import TechnicalMapForm from "Pages/AdminPages/Category/TachnicalMapForm";
import Product from "Pages/AdminPages/Product";
import AddEditProduct from "Pages/AdminPages/Product/AddEditProduct";
import Setting from "Pages/AdminPages/Setting";
import Website from "Pages/AdminPages/Website";
import Mail from "Pages/AdminPages/Mail";
import ViewMail from "Pages/AdminPages/Mail/ViewMail";
import Report from "Pages/AdminPages/Report";
import Customer from "Pages/AdminPages/Customer";
import AddEditCustomer from "Pages/AdminPages/Customer/AddEditCustomer";
import { AddOrders } from "Pages/AdminPages/Orders/AddOrders";
import Testdrag from "Pages/AdminPages/testdrag.js";


// icons
import { ReactComponent as DashboardIcon } from "Assets/img/icons/sidebar-dashboard.svg";
import { ReactComponent as BlogIcon } from "Assets/img/icons/sidebar-blog.svg";
import { ReactComponent as LibraryIcon } from "Assets/img/icons/sidebar-library.svg";
import { ReactComponent as CommentIcon } from "Assets/img/icons/sidebar-comment.svg";
import { ReactComponent as TeamIcon } from "Assets/img/icons/sidebar-team.svg";
import { ReactComponent as CouponIcon } from "Assets/img/icons/sidebar-coupon.svg";
import { ReactComponent as CategoryIcon } from "Assets/img/icons/sidebar-category.svg";
import { ReactComponent as ProductIcon } from "Assets/img/icons/sidebar-product.svg";
import { ReactComponent as SettingIcon } from "Assets/img/icons/sidebar-setting.svg";
import { ReactComponent as WebsiteIcon } from "Assets/img/icons/sidebar-website.svg";
import { ReactComponent as MailIcon } from "Assets/img/icons/sidebar-mail.svg";
import { ReactComponent as ReportIcon } from "Assets/img/icons/sidebar-report.svg";
import { ReactComponent as CustomerIcon } from "Assets/img/icons/sidebar-customer.svg";
import { ReactComponent as OrderIcon } from "Assets/img/icons/sidebar-order.svg";


const adminRoutes = [
  // DASHBOARD
  {
    path: "/dashboard",
    name: "داشبورد من",
    icon: <DashboardIcon />,
    component: Dashboard,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  // CUSTOMER
  {
    path: "/customer",
    name: "کاربران من",
    icon: <CustomerIcon />,
    component: Customer,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/customer/add-customer",
    component: AddEditCustomer,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/customer/edit-customer/:id",
    component: AddEditCustomer,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },

  // PRODUCT
  {
    path: "/product",
    name: "محصولات من",
    icon: <ProductIcon />,
    component: Product,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  // orders
  {
    path: "/orders",
    name: "لیست سفارشات",
    icon: <OrderIcon />,
    component: Orders,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/orders/add-order",
    component: AddOrders,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/orders/edit-order/:id",
    component: AddOrders,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/product/add-product",
    component: AddEditProduct,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/product/edit-product/:id",
    component: AddEditProduct,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },

  // CATEGORY
  {
    path: "/category",
    name: "دسته بندی‌های من",
    icon: <CategoryIcon />,
    component: Category,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  {
    path: "/category/edit-technical-map/:id",
    component: TechnicalMapForm,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },

  // TEAM
  {
    path: "/team",
    name: "مدیریت تیم من",
    icon: <TeamIcon />,
    component: Team,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  {
    path: "/team/add-member",
    component: AddEditMember,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/team/edit-member/:id",
    component: AddEditMember,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  //Page
  {
    path: "/page",
    component: Page,
    exact: true,
    icon: <TeamIcon />,
    name: "صفحات سایت",
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/page/add-page",
    component: AddEditPage,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/page/edit-page/:id",
    component: AddEditPage,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  // COUPON
  {
    path: "/coupon",
    name: "تخفیف‌ها",
    icon: <CouponIcon />,
    component: Coupon,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/coupon/add-coupon",
    component: AddEditCoupon,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },





  {
    path: "/coupon/edit-coupon/:id",
    component: AddEditCoupon,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/coupon/view-coupon/:id",
    component: ViewCoupon,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },

  // COMMENTS
  {
    path: "/comments",
    name: "دیدگاه و پرسش و پاسخ",
    icon: <CommentIcon />,
    component: Comment,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  // BLOG
  {
    path: "/blog",
    name: "وبلاگ من",
    icon: <BlogIcon />,
    component: Blog,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/blog/add-post",
    component: AddAndEditPost,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  {
    path: "/blog/edit-post/:id",
    component: AddAndEditPost,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },
  // LIBRARY
  {
    path: "/library",
    name: "کتابخانه",
    icon: <LibraryIcon />,
    component: Library,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  // REPORT
  {
    path: "/report",
    name: "گزارشات",
    icon: <ReportIcon />,
    component: Report,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  // MAIL
  {
    path: "/mail",
    name: "صندوق پیام",
    icon: <MailIcon />,
    component: Mail,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },
  {
    path: "/mail/view-mail/:id",
    component: ViewMail,
    exact: true,
    showInMenu: false,
    layout: "/admin",
  },

  // WEBSITE
  {
    path: "/website-setting",
    name: "مدیریت وبسایت",
    icon: <WebsiteIcon />,
    component: Website,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  // SETTING
  {
    path: "/setting",
    name: "تنظیمات",
    icon: <SettingIcon />,
    component: Setting,
    exact: true,
    showInMenu: true,
    layout: "/admin",
  },

  // {
  //   name: "Pages",
  //   icon: <DashboardIcon />,
  //   // dont write path here if it has sub route
  //   // added nested routes
  //   routes: [
  //     {
  //       // Also note how we added /home before the
  //       // actual page name just to create a complete path
  //       name: "Pages",
  //       path: "/pages/page1",
  //       layout: "/admin",
  //       component: Page_1,
  //     },
  //     {
  //       name: "Pages",
  //       path: "/pages/page2",
  //       layout: "/admin",
  //       component: Page_2,
  //     },
  //   ],
  // },
];

export default adminRoutes;
