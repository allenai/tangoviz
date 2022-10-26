import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const dateWithTime = 'M/D/YY h:mm:ss a';

/**
 * Duration (and duration relative)
 * 1/2/1-1/3/1 (14 hours)
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
 * When started (and started relative)
 * 1/1/1 (21 hours ago)
 *
 * When ended (and ended relative)
 * 1/2/1 (21 hours ago)
 */

export const RelativeTime = ({ date }: { date?: string }) => {
    if (!date) {
        return <span></span>;
    }
    const d = dayjs(date);
    return (
        <span>
            {d.fromNow()}
            <br />
            {d.format(dateWithTime)}
        </span>
    );
};
