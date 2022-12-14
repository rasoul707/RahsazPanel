import { useEffect, useState, } from "react";

import { makeStyles } from "@material-ui/core/styles";

// Components
import { SelectInput, DateRangePicker } from "Components/Inputs";

// Assets
import { ReactComponent as SearchIcon } from "Assets/img/icons/search-input.svg";
import { ReactComponent as CloseIcon } from "Assets/img/icons/close.svg";



const useStyles = makeStyles(theme => ({
  tableHeaderWrapper: {
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > div": {
      display: "flex",
      alignItems: "center",
    },

    "& .ThirdlyUI_InputRoot": {
      marginBottom: 0,
      marginRight: 8,
    },
    "& .ThirdlyUI_InputErrorMessage": {
      display: "none",
    },
  },
  totalItems: {
    fontSize: 16,
    fontWeight: 400,
  },
  searchInput: {
    padding: "10px 12px",
    border: "1px solid #EBEBEB",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",

    "& > svg": {
      cursor: "pointer",
    },

    "& > input": {
      border: "none",
      background: "none",
      outline: "none",
      width: 185,
    },
  },
  sortSelect: {
    width: 200,
    marginBottom: 0,
  },
}));

export default function PageHeader({
  title,
  totalItemsCount,
  searchValue,
  setSearchValue,
  sort,
  right,
  showSearch,
  showRangeFilter,
  handleDateRangeChange,
}) {
  const classes = useStyles();
  // wget http://download.bt.cn/install/public.sh

  // handle search value
  const [search, setSearch] = useState(searchValue);

  const handleOnChange = e => {
    setSearch(e?.target?.value);
  };

  const handleSetSearchValue = e => {
    if (e?.keyCode === 13) {
      setSearchValue(search);
    }
  };

  useEffect(() => {
    setSearch(searchValue || "")
  }, [searchValue])



  return (
    <div className={classes.tableHeaderWrapper}>
      <div>
        <h4 className={classes.totalItems}>
          {
            totalItemsCount
              ? (Number(totalItemsCount).toLocaleString("fa-IR") + " " + title)
              : ""
          }
        </h4>
      </div>
      <div>
        {right}
        {!!sort?.options && (
          <SelectInput
            className={classes.sortSelect}
            name={sort.name}
            placeholder={sort.placeholder}
            withoutControl={true}
            options={sort.options}
            autoFindValue
            defaultValue={sort.sortValue}
            onChange={optionValue => sort?.setSortValue(optionValue)}
          />
        )}
        {/* SEARCH  */}
        {showSearch && (
          <div className={classes.searchInput}>
            {searchValue ? (
              <CloseIcon
                onClick={() => {
                  setSearchValue("");
                  setSearch("");
                }}
              />
            ) : (
              <SearchIcon onClick={() => setSearchValue(search)} />
            )}

            <input
              value={search}
              onChange={handleOnChange}
              onKeyDown={handleSetSearchValue}
              placeholder="?????????? ????????"
            />
          </div>
        )}
        {/* DATE RANGE FILTER  */}
        {showRangeFilter && (
          <DateRangePicker withoutControl onChange={handleDateRangeChange} />
        )}
      </div>
    </div>
  );
}
