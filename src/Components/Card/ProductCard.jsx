import { makeStyles } from "@material-ui/core/styles";
import { NAString } from "Utils/helperFunction";

// Assets
import DefaultProductImage from "Assets/img/default-product.png";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";

const useStyles = makeStyles(theme => ({
  productCard: {
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    border: "1px solid #EBEBEB",
    borderRadius: 8,
    width: 80,
    height: 80,
    objectFit: "cover",
  },
  info: {
    "& > h4": {
      padding: "5px 12px",
      borderRadius: 8,
      background: "#FAFAFA",
      display: "inline-block",
      marginBottom: 6,
      fontSize: 12,
    },
    "& > strong": {
      display: "inline-block",
      marginBottom: 6,
      fontSize: 12,
    },
  },
  price: {
    "& > span": {
      color: "#616161",
      fontSize: 12,
    },
    "& > strong": {
      color: "#F6891F",
      fontSize: 12,
      fontWeight: 400,
    },
  },
  delete: {
    background: "#FF000010",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    cursor: "pointer",
  },
}));

export default function ProductCard({ product, handleDelete }) {
  const classes = useStyles();

  return (
    <div className={classes.productCard}>
      <div className="d-flex align-items-center" style={{ gap: "14px" }}>
        <img
          className={classes.image}
          src={`${process.env.REACT_APP_FILE_BASE_URL}${product?.cover_image?.image?.path}`}
          alt=""
        />
        <div className={classes.info}>
          <h4>{NAString(product?.name)}</h4>
          <br />
          <strong>{NAString(product?.description)}</strong>
          <div className={classes.price}>
            <span>قیمت محصول: </span>
            <strong>
              {Number(product?.price_in_toman_for_bronze_group|| 0).toLocaleString("fa-IR")}{" "}
              تومان
            </strong>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleDelete(product?.id)}
        className={classes.delete}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
