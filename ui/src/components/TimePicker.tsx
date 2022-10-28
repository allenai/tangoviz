// see: https://ant.design/docs/react/replace-moment

import { Dayjs } from 'dayjs';
import React from 'react';

import { PickerTimeProps } from 'antd/lib/date-picker/generatePicker';

import DatePicker from './DatePicker';

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
    return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
