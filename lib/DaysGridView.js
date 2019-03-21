import React from 'react';
import {
  View,
  Text,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Day from './Day';
import { getDaysInMonth } from './Utils';
import s from './styles';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default function DaysGridView(props) {
  const {
    month,
    year,
    style,
    onPressDay,
    startFromMonday,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    textStyle,
    todayTextStyle,
    selectedDayStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    customDatesStyles,
    minDate,
    maxDate,
    disabledDates,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    weekRowStyle,
    dayStyles,
  } = props;
  // let's get the total of days in this month, we need the year as well, since
  // leap years have different amount of days in February
  const totalDays = getDaysInMonth(month, year);
  // Let's create a date for day one of the current given month and year
  const firstDayOfMonth = moment({ year, month, day: 1 });
  // isoWeekday() gets the ISO day of the week with 1 being Monday and 7 being Sunday.
  // We will need this to know what day of the week to show day 1
  // See https://github.com/stephy/CalendarPicker/issues/49
  const firstWeekDay = firstDayOfMonth.isoWeekday();
  // fill up an array of days with the amount of days in the current month
  // eslint-disable-next-line prefer-spread
  const days = Array.apply(null, { length: totalDays }).map(
    Number.call,
    Number,
  );
  const guideArray = [0, 1, 2, 3, 4, 5, 6];

  // Get the starting index, based upon whether we are using monday or sunday as first day.
  const startIndex = startFromMonday
    ? (firstWeekDay - 1) % 7
    : firstWeekDay;

  function getDay() {
    const day = days.shift() + 1;
    return (
      <Day
        key={day}
        day={day}
        month={month}
        year={year}
        styles={dayStyles}
        onPressDay={onPressDay}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        allowRangeSelection={allowRangeSelection}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        minRangeDuration={minRangeDuration}
        maxRangeDuration={maxRangeDuration}
        textStyle={textStyle}
        todayTextStyle={todayTextStyle}
        selectedDayStyle={selectedDayStyle}
        selectedRangeStartStyle={selectedRangeStartStyle}
        selectedRangeStyle={selectedRangeStyle}
        selectedRangeEndStyle={selectedRangeEndStyle}
        customDatesStyles={customDatesStyles}
        enableDateChange={enableDateChange}
      />
    );
  }

  function generateColumns(i) {
    const column = guideArray.map((index) => {
      if (i === 0) {
        // for first row, let's start showing the days on the correct weekday
        if (index >= startIndex) {
          if (days.length > 0) {
            return getDay();
          }
        }
      } else if (days.length > 0) {
        return getDay();
      }
      return null;
    });
    return column;
  }

  return (
    <View style={style}>
      {guideArray.map((index) => (
        <View
          key={index}
          style={[
            s.weekRow,
            index === 0 && s.weekRowWithEmptyDays,
            weekRowStyle,
          ]}
        >
          {generateColumns(index)}
        </View>
      ))}
    </View>
  );
}

DaysGridView.propTypes = {
  style: ViewPropTypes.style,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onPressDay: PropTypes.func,
  startFromMonday: PropTypes.bool,
  selectedDayStyle: ViewPropTypes.style,
  weekRowStyle: ViewPropTypes.style,
  selectedRangeStartStyle: ViewPropTypes.style,
  selectedRangeStyle: ViewPropTypes.style,
  selectedRangeEndStyle: ViewPropTypes.style,
  todayTextStyle: Text.propTypes.style,
  customDatesStyles: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment),
      ]),
      containerStyle: ViewPropTypes.style,
      style: ViewPropTypes.style,
      textStyle: Text.propTypes.style,
    }),
  ),
  disabledDates: PropTypes.array,
  minRangeDuration: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]),
  maxRangeDuration: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]),
  selectedStartDate: PropTypes.object,
  selectedEndDate: PropTypes.object,
  allowRangeSelection: PropTypes.bool,
  textStyle: Text.propTypes.style,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  enableDateChange: PropTypes.bool,
};