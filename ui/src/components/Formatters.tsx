import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const dateWithTime = 'M/D/YY H:mm:ss';

/**
 * Duration
 *
 * 14 hours
 * 1/2/22 9:45:00 - 1/2/22 15:5:01
 */
export const RelativeDuration = ({ start, end }: { start?: string; end?: string }) => {
    if (!end || !start) {
        return <RelativeTime date={start} />;
    }
    const s = dayjs(start);
    const e = dayjs(end);
    return (
        <span>
            {dayjs.duration(e.diff(s)).humanize()}
            <br />
            {s.format(dateWithTime)} - {e.format(dateWithTime)}
        </span>
    );
};

/**
 * Datetime
 * 21 hours ago (1/2/22 9:45:00)
 */
export const RelativeTime = ({ date }: { date?: string }) => {
    if (!date) {
        return <></>;
    }
    const d = dayjs(date);
    return (
        <span>
            {d.fromNow()} ({d.format(dateWithTime)})
        </span>
    );
};
