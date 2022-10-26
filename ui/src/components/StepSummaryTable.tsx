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
import { StepSummary } from '../api/Step';
import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIcon } from '../components/StatusIcon';
import { StatusArray } from '../api/Status';

interface Props {
    data: StepSummary[];
    workspaceId: string;
}

export function StepSummaryTable({ data, workspaceId }: Props) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<StepSummary>,
        getSelectFilterBy: GetSelectFilterByType<StepSummary>
    ): ColumnsType<StepSummary> => {
        return [
            {
                title: getSelectFilterBy(
                    'Status',
                    (value: string, records: StepSummary[]) => {
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
                title: getInputFilterBy('ID', (value: string, records: StepSummary[]) => {
                    return records.filter((record) => {
                        return record.name.toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'id',
                key: 'id',
                width: 300,
                sorter: sortByString((item) => item.id),
                render: (val, obj) => (
                    <a href={`/workspace/${workspaceId}/step/${btoa(obj.id)}`}>{val}</a>
                ),
            },
            {
                title: getInputFilterBy('Name', (value: string, records: StepSummary[]) => {
                    return records.filter((record) => {
                        return record.name.toLowerCase().includes(value.toLowerCase());
                    });
                }),
                dataIndex: 'name',
                key: 'name',
                width: 300,
                sorter: sortByString((item) => item.name),
            },
            {
                title: getInputFilterBy('Started', (value: string, records: StepSummary[]) => {
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
                title: getInputFilterBy('Ended', (value: string, records: StepSummary[]) => {
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

    return <BaseTable<StepSummary> dataKey="name" data={data} getColumns={getColumns} />;
}
