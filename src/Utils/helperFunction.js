import React from "react";
import moment from "moment";

// take a route name
// and if route name includes in website current route return a true
export const activeRoute = routeName => {
  return window.location.href.indexOf(routeName) > -1;
};

// take a value(text, number, ...)
// if value dosen't exist(null, undefined, ...) then return "-"
export const fixUndefinedText = routeName => {
  return routeName === 0 ? routeName : routeName || "-";
};

// take a date
// return date on this format "1 aban 1394"
export const formatDate = (date, showTime) => {
  let options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("fa-IR", options);
  const time = moment(new Date(date)).format("HH:mm");
  return showTime ? `${formattedDate} ${time}` : formattedDate;
};

// take a number
// return added seprator and toman
export const formatPrice = price => {
  return price == 0
    ? "0 تومان"
    : price
    ? `${Number(price).toLocaleString("fa-IR")} تومان`
    : "-";
};

// take component and props
// add props to component
export const componentPropsValidator = (component, props) => {
  if (React.isValidElement(component)) {
    return component;
  } else if (component instanceof Function) {
    let Component = component;
    return <Component {...props} />;
  } else return component;
};

// NA String
export function mergeString(seperate = " ", ...rest) {
  const text = [...rest]
    .filter(data => {
      if (data === 0) return "0";
      return data;
    })
    .join(seperate);

  const hasData = text.replaceAll(seperate, "").length;
  if (hasData) return text;
  else return "-";
}
mergeString.one = function (data) {
  if (data === 0) return "0";
  return data || "-";
};

// if all array indexes to be undefined, return N/A
export const NAString = (
  (seperate = " ") =>
  (...rest) => {
    return rest.length === 1 || !rest.length
      ? mergeString.one(rest[0])
      : mergeString(seperate, ...rest);
  }
)();
export const getValuesByKeys = (object, keys = []) =>
  keys.map(data => object[data]);

NAString.seperat = (seperate = "", ...rest) =>
  rest.length === 1 || !rest.length
    ? mergeString.one(rest[0])
    : mergeString(seperate, ...rest);
// Example:: NAString.seperat(', ', name, undefined, family) or NAString.seperat('', 'address')

NAString.seperateWithObject = (seperate = "", object, keys) => {
  const rest = getValuesByKeys(object, keys);
  rest.length === 1 || !rest.length
    ? mergeString.one(rest[0])
    : mergeString(seperate, ...rest);
};

export const proccesStatus = status => {
  switch (status) {
    case "در انتظار تایید سفارش":
      return {
        borderColor: "#FFF068",
        color: "#CDAF0F",
        backgroundColor: "#FFFBD8",
      };
    case "در حال بسته بندی":
      return {
        borderColor: "#FFF068",
        color: "#E57E44",
        backgroundColor: "#FFFBED",
      };
    case "خروج از انبار":
      return {
        borderColor: "#84AEEC",
        color: "#1A5EC4",
        backgroundColor: "#F3F8FF",
      };
    case "تحویل به باربری":
      return {
        borderColor: "#B7EB8F",
        color: "#52C41A",
        backgroundColor: "#F6FFED",
      };

    case "تکمیل شده":
      return {
        borderColor: "#B7EB8F",
        color: "#52C41A",
        backgroundColor: "#F6FFED",
      };
    case "کنسل شده":
      return {
        borderColor: "#FFB4B4",
        color: "#FF0000",
        backgroundColor: "#FFECEC",
      };
    case "مرجوعی":
      return {
        borderColor: "#C4C4C4",
        color: "#616161",
        backgroundColor: "#FAFAFA",
      };
    default:
      return {
        borderColor: "#B7EB8F",
        color: "#52C41A",
        backgroundColor: "#F6FFED",
      };
  }
};

export const findBrowser = arr => {
  let chrome = 0;
  let fireFox = 0;
  let safari = 0;
  let opera = 0;
  let edge = 0;

  arr?.map(({ agent }) => {
    let userAgent = agent;
    if (userAgent.match(/chrome|chromium|crios/i)) {
      chrome++;
    } else if (userAgent.match(/firefox|fxios/i)) {
      fireFox++;
    } else if (userAgent.match(/safari/i)) {
      safari++;
    } else if (userAgent.match(/opr\//i)) {
      opera++;
    } else if (userAgent.match(/edg/i)) {
      edge++;
    } else {
    }
  });

  let max = Math.max(chrome, fireFox, safari, opera, edge);
  return max == chrome
    ? "Chrome"
    : max == fireFox
    ? "FireFox"
    : max == safari
    ? "Safari"
    : max == opera
    ? "Opera"
    : max == edge
    ? "Edge"
    : "";
};

export const routeWithFaName = user_permissions => {
  let faRoute = [
    {
      name: "محصولات من",
      path: "/product",
    },
    {
      name: "داشبورد من",
      path: "/dashboard",
    },
    {
      name: "تخفیف ها",
      path: "/coupon",
    },
    {
      name: "صفحات سایت",
      path: "/page",
    },
    {
      name: "کتابخانه",
      path: "/library",
    },
    {
      name: "مدیریت وبسایت",
      path: "/website-setting",
    },
    {
      name: "دسته بندی های من",
      path: "/category",
    },
    {
      name: "دیدگاه و پرسش و پاسخ",
      path: "/comments",
    },
    {
      name: "صندوق پیام",
      path: "/mail",
    },
    {
      name: "لیست سفارشات",
      path: "/orders",
    },
    {
      name: "مدیریت تیم من",
      path: "/team",
    },
    {
      name: "وبلاگ من",
      path: "/blog",
    },
    {
      name: "کاربران من",
      path: "/customer",
    },
    {
      name: "تنظیمات",
      path: "/setting",
    },
    {
      name: "گزارشات",
      path: "/report",
    },
  ];

  let tagNames = user_permissions?.map(({ tag_id_fa }) => tag_id_fa);
  let routes = faRoute
    .filter(item => tagNames?.includes(item?.name))
    ?.map(({ path }) => path);
  return routes;
};

export const fixDate = value => {
  let validDate=value??new Date().toLocaleDateString()
  return new Date(validDate)
    .toLocaleDateString("fa-IR")
    .replace(/([۰-۹])/g, token =>
      String.fromCharCode(token.charCodeAt(0) - 1728),
    );
};
