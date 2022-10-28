// see: https://ant.design/docs/react/replace-moment

import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/lib/date-picker/generatePicker';

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig as any);

export default DatePicker;
