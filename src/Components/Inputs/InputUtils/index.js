import React from "react";

export const reactSelectStyles = {
  control: provided => ({
    ...provided,
    fontFamily: "inherit",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "18px",

    color: "#001738",
    backgroundColor: "#fff",
    transition: "inherit",

    width: "100%",
    height: "100%",
    padding: "8px 8px",

    borderRadius: 8,
    boxShadow: "none",
    outline: "none",
    border: 0,
    "&:hover": { border: 0 },
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0,
  }),
  indicatorsContainer: provided => ({
    ...provided,
    padding: "0 4px",
    cursor: "pointer",
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: 0,
  }),
  clearIndicator: provided => ({
    ...provided,
    padding: "0 4px",
    cursor: "pointer",
  }),
  placeholder: provided => ({
    ...provided,
    color: "#c0ccda",
  }),
  menuPortal: provided => ({
    ...provided,
    zIndex: 9999,
    fontFamily: "inherit",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "18px",
    color: "#001738",
    backgroundColor: "#fff",
    transition: "inherit",
  }),
  menu: provided => ({
    ...provided,
    marginTop: 0,
    borderRadius: "0 0 2.5px 2.5px",
    border: "1px solid #e5e9f2",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#1458ea" : "white",
    cursor: "pointer",
    "&:hover": {
      background: state.isSelected ? "#1458ea" : "#B2D4FF",
    },
  }),
};

export const phoneSelectStyles = {
  ...reactSelectStyles,
  container: (provided, state) => ({
    ...provided,
    height: "100%",
    border: 0,
  }),
  control: (provided, state) => ({
    ...reactSelectStyles.control(provided, state),
    ...{
      padding: 0,
    },
  }),
  valueContainer: (provided, state) => ({
    padding: 0,
    minWidth: 50,
    display: "flex",
    justifyContent: "center",
  }),
};
{
  /* <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 1.375L6 6.625L0.75 1.375" stroke="#C0CCDA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg> */
}

const flagIcons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // x='0px'
    // y='0px'
    viewBox="0 0 512 512"
    width="18"
    height="18"
  >
    <path
      fill="#41479B"
      d="M473.655,88.276H38.345C17.167,88.276,0,105.443,0,126.621V385.38
	c0,21.177,17.167,38.345,38.345,38.345h435.31c21.177,0,38.345-17.167,38.345-38.345V126.621
	C512,105.443,494.833,88.276,473.655,88.276z"
    />
    <path
      fill="#F5F5F5"
      d="M511.469,120.282c-3.022-18.159-18.797-32.007-37.814-32.007h-9.977l-163.54,107.147V88.276h-88.276
	v107.147L48.322,88.276h-9.977c-19.017,0-34.792,13.847-37.814,32.007l139.778,91.58H0v88.276h140.309L0.531,391.717
	c3.022,18.159,18.797,32.007,37.814,32.007h9.977l163.54-107.147v107.147h88.276V316.577l163.54,107.147h9.977
	c19.017,0,34.792-13.847,37.814-32.007l-139.778-91.58H512v-88.276H371.691L511.469,120.282z"
    />
    <g>
      <polygon
        fill="#FF4B55"
        points="282.483,88.276 229.517,88.276 229.517,229.517 0,229.517 0,282.483 229.517,282.483 
		229.517,423.724 282.483,423.724 282.483,282.483 512,282.483 512,229.517 282.483,229.517 	"
      />
      <path
        fill="#FF4B55"
        d="M24.793,421.252l186.583-121.114h-32.428L9.224,410.31
		C13.377,415.157,18.714,418.955,24.793,421.252z"
      />
      <path
        fill="#FF4B55"
        d="M346.388,300.138H313.96l180.716,117.305c5.057-3.321,9.277-7.807,12.287-13.075L346.388,300.138z"
      />
      <path
        fill="#FF4B55"
        d="M4.049,109.475l157.73,102.387h32.428L15.475,95.842C10.676,99.414,6.749,104.084,4.049,109.475z"
      />
      <path
        fill="#FF4B55"
        d="M332.566,211.862l170.035-110.375c-4.199-4.831-9.578-8.607-15.699-10.86L300.138,211.862H332.566z"
      />
    </g>
  </svg>,
];

export const phoneOptions = [
  {
    label: (
      <div style={{ display: "flex" }}>
        <div>{flagIcons[0]}</div>&nbsp;
        <div>+1</div>
      </div>
    ),
    value: 1,
  },
  {
    label: (
      <div style={{ display: "flex" }}>
        <div>{flagIcons[0]}</div>&nbsp;
        <div>+2</div>
      </div>
    ),
    value: 2,
  },
  {
    label: (
      <div style={{ display: "flex" }}>
        <div>{flagIcons[0]}</div>&nbsp;
        <div>+3</div>
      </div>
    ),
    value: 3,
  },
];
