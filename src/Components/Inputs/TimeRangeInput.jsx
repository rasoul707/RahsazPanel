import React from "react";
import { TimePicker } from "antd";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  timeRangePicker: {
    height: 40,
    border: "1px solid #E5E9F2",
    borderRadius: 2.5,
  },
  label: {},
}));

const { RangePicker } = TimePicker;

export default function TimeRangeInput({
  className,
  label,
  order,
  name,
  getTimes,
}) {
  const cls = useStyles();

  return (
    <div className={className}>
      <label className={cls.label}> {label} </label>
      <RangePicker
        className={cls.timeRangePicker}
        onCalendarChange={(momentValues, [startTime, endTime], range) => {
          if (startTime.length != 0 && endTime.length != 0) {
            const timeDifference = moment
              .utc(
                moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss")),
              )
              .format("HH:mm:ss");
            getTimes?.({
              start: startTime,
              end: endTime,
              diff: timeDifference,
            });
          }
        }}
        order={order}
      />
    </div>
  );
}

TimeRangeInput.defaultProps = {};
