import { FormHelperText, InputLabel, Stack } from '@mui/material';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { TimeRangeWrapper } from './CustomtimeRangePicker.style';

type CustomTimeRangePickerType = {
  startTime: Date | string;
  endTime: Date | string;
  onChangeStartTime: (date: Date) => void;
  onChangeEndTime: (date: Date) => void;
  placeholderStartTime?: string;
  placeHolderEndTime?: string;
  errorStartTime?: string;
  errorEndTime?: string;
  timeIntervals?: number;
  showLabel?: boolean;
  labelStartTime?: string;
  labelEndTime?: string;
};

function CustomTimeRangePicker({
  startTime,
  endTime,
  onChangeStartTime,
  onChangeEndTime,
  placeholderStartTime = 'Start Time',
  placeHolderEndTime = 'End Time',
  errorStartTime = '',
  errorEndTime = '',
  timeIntervals = 30,
  showLabel = false,
  labelStartTime = 'Start Time',
  labelEndTime = 'End Time'
}: CustomTimeRangePickerType) {
  return (
    <Stack direction="row" gap={1}>
      <TimeRangeWrapper>
        {showLabel && <InputLabel sx={{ mb: 0.5 }}>{labelStartTime}</InputLabel>}
        <DatePicker
          selected={startTime}
          onChange={onChangeStartTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={timeIntervals}
          timeCaption="Time"
          dateFormat="h:mmaa"
          placeholderText={placeholderStartTime}
          isClearable
        />
        {errorStartTime && (
          <FormHelperText error id="startTime-error">
            {errorStartTime}
          </FormHelperText>
        )}
      </TimeRangeWrapper>
      <TimeRangeWrapper>
        {showLabel && <InputLabel sx={{ mb: 0.5 }}>{labelEndTime}</InputLabel>}
        <DatePicker
          selected={endTime}
          onChange={onChangeEndTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={timeIntervals}
          timeCaption="Time"
          dateFormat="h:mmaa"
          placeholderText={placeHolderEndTime}
          isClearable
        />
        {errorEndTime && (
          <FormHelperText error id="startTime-error">
            {errorEndTime}
          </FormHelperText>
        )}
      </TimeRangeWrapper>
    </Stack>
  );
}

export default CustomTimeRangePicker;
