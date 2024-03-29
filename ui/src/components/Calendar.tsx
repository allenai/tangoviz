// see: https://ant.design/docs/react/replace-moment

import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generateCalendar from 'antd/lib/calendar/generateCalendar';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig as any);

export default Calendar;
