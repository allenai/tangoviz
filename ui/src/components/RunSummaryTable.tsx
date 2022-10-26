import React from 'react';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import {
    BaseTable,
    GetInputFilterByType,
    GetSelectFilterByType,
    sortByString,
    sortByNumber,
} from './BaseTable';
import { RunSummary } from '../api/Run';
import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIcon } from '../components/StatusIcon';
import { StatusArray } from '../api/Status';

interface Props {
    data: RunSummary[];
    workspaceId: string;
}

export function RunSummaryTable({ data, workspaceId }: Props) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<RunSummary>,
        getSelectFilterBy: GetSelectFilterByType<RunSummary>
    ): ColumnsType<RunSummary> => {
        return [
            {
                title: getSelectFilterBy(
                    'Status',
                    (value: string, records: RunSummary[]) => {
                        return records.filter((record) => {
                            return record.status.toLowerCase().includes(value.toLowerCase());
                        });
                    },
                    StatusArray
                ),
                dataIndex: 'status',
                key: 'status',
                width: 200,
                sorter: sortByString((item) => item.status),
                render: (val, _) => <StatusIcon status={val} />,
            },
            {
                title: getInputFilterBy('Name', (value: string, records: RunSummary[]) => {
                    return records.filter((record) => {
                        return record.name.toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'name',
                key: 'name',
                width: 300,
                sorter: sortByString((item) => item.name),
                render: (val, obj) => (
                    <a href={`/workspace/${workspaceId}/run/${btoa(obj.name)}`}>{val}</a>
                ),
            },
            {
                title: getInputFilterBy('Started', (value: string, records: RunSummary[]) => {
                    return records.filter((record) => {
                        return (record.started || '').toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'started',
                key: 'started',
                width: 200,
                sorter: sortByString((item) => item.started),
                render: (val, _) => <RelativeTime date={val} />,
            },
            {
                title: getInputFilterBy('Ended', (value: string, records: RunSummary[]) => {
                    return records.filter((record) => {
                        return (record.ended || '').toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'ended',
                key: 'ended',
                width: 200,
                sorter: sortByString((item) => item.ended),
                render: (val, _) => <RelativeTime date={val} />,
            },
            {
                title: getInputFilterBy('Step Status', (value: string, records: RunSummary[]) => {
                    return records.filter((record) => {
                        return record.stepStatus.toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'stepStatus',
                key: 'stepStatus',
                width: 200,
                sorter: sortByString((item) => item.stepStatus),
            },
            {
                title: 'Duration',
                key: 'duration',
                width: 200,
                sorter: sortByNumber((item) => {
                    return dayjs(item.ended).diff(dayjs(item.started));
                }),
                render: (_, obj) => <RelativeDuration start={obj.started} end={obj.ended} />,
            },
        ];
    };

    return <BaseTable<RunSummary> dataKey="name" data={data} getColumns={getColumns} />;
}
