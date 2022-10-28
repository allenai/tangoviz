import React from 'react';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
import isBetween from 'dayjs/plugin/isBetween';

import {
    BaseTable,
    GetInputFilterByType,
    GetSelectFilterByType,
    GetDateFilterByType,
    sortByString,
    sortByNumber,
} from './BaseTable';
import { StepSummary, RunStepSummary } from '../api/Step';
import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from '../components/StatusIcon';
import { StatusArray } from '../api/Status';

dayjs.extend(isBetween);

interface Props<T> {
    data: T[];
    workspaceId: string;
}

export function StepSummaryTable({ data, workspaceId }: Props<StepSummary>) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<StepSummary>,
        getSelectFilterBy: GetSelectFilterByType<StepSummary>,
        getDateFilterBy: GetDateFilterByType<StepSummary>
    ): ColumnsType<StepSummary> => {
        return [
            ...getStatusCol(getSelectFilterBy),
            ...getIdCol(getInputFilterBy, workspaceId),
            ...getStartedCol(getDateFilterBy),
            ...getEndedCol(getDateFilterBy),
            ...getDurationCol(),
        ];
    };

    return <BaseTable<StepSummary> dataKey="id" data={data} getColumns={getColumns} />;
}

export function RunStepSummaryTable({ data, workspaceId }: Props<RunStepSummary>) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<RunStepSummary>,
        getSelectFilterBy: GetSelectFilterByType<RunStepSummary>,
        getDateFilterBy: GetDateFilterByType<RunStepSummary>
    ): ColumnsType<RunStepSummary> => {
        return [
            ...getStatusCol(getSelectFilterBy),
            ...getIdCol(getInputFilterBy, workspaceId),
            ...getOrderCol(getInputFilterBy),
            ...getNameCol(getInputFilterBy),
            ...getStartedCol(getDateFilterBy),
            ...getEndedCol(getDateFilterBy),
            ...getDurationCol<RunStepSummary>(),
        ];
    };

    return <BaseTable<RunStepSummary> dataKey="id" data={data} getColumns={getColumns} />;
}

function getStatusCol<T extends StepSummary>(
    getSelectFilterBy: GetSelectFilterByType<T>
): ColumnsType<T> {
    return [
        {
            title: getSelectFilterBy(
                'Status',
                (value: string, records: T[]) => {
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
            render: (val) => <StatusIconWithLabel status={val} />,
        },
    ];
}

function getIdCol<T extends StepSummary>(
    getInputFilterBy: GetInputFilterByType<T>,
    workspaceId: string
): ColumnsType<T> {
    return [
        {
            title: getInputFilterBy('ID', (value: string, records: T[]) => {
                return records.filter((record) => {
                    return record.id.toLowerCase().includes(value.toLowerCase());
                });
            }),
            dataIndex: 'id',
            key: 'id',
            width: 200,
            sorter: sortByString((item) => item.id),
            render: (val, obj) => (
                <a href={`/workspace/${workspaceId}/step/${btoa(obj.id)}`}>{val}</a>
            ),
        },
    ];
}

function getOrderCol<T extends RunStepSummary>(
    getInputFilterBy: GetInputFilterByType<T>
): ColumnsType<T> {
    return [
        {
            title: getInputFilterBy('Order', (value: string, records: T[]) => {
                return records.filter((record) => {
                    return (record.order || 0).toString().includes(value.toLowerCase());
                });
            }),
            dataIndex: 'order',
            key: 'order',
            width: 100,
            sorter: sortByNumber((item) => item.order),
        },
    ];
}

function getNameCol<T extends RunStepSummary>(
    getInputFilterBy: GetInputFilterByType<T>
): ColumnsType<T> {
    return [
        {
            title: getInputFilterBy('Name', (value: string, records: T[]) => {
                return records.filter((record) => {
                    return (record.name || '').toLowerCase().includes(value.toLowerCase());
                });
            }),
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: sortByString((item) => item.name),
        },
    ];
}

function getStartedCol<T extends StepSummary>(
    getDateFilterBy: GetDateFilterByType<T>
): ColumnsType<T> {
    return [
        {
            title: getDateFilterBy('Started', (value: RangeValue<Dayjs>, records: T[]) => {
                return records.filter((record) => {
                    if (!record.started || !value) {
                        return false;
                    }
                    return dayjs(record.started).isBetween(value[0], value[1]);
                });
            }),
            dataIndex: 'started',
            key: 'started',
            width: 260,
            sorter: sortByString((item) => item.started),
            render: (val, _) => <RelativeTime date={val} />,
        },
    ];
}

function getEndedCol<T extends StepSummary>(
    getDateFilterBy: GetDateFilterByType<T>
): ColumnsType<T> {
    return [
        {
            title: getDateFilterBy('Ended', (value: RangeValue<Dayjs>, records: T[]) => {
                return records.filter((record) => {
                    if (!record.started || !value) {
                        return false;
                    }
                    return dayjs(record.started).isBetween(value[0], value[1]);
                });
            }),
            dataIndex: 'ended',
            key: 'ended',
            width: 260,
            sorter: sortByString((item) => item.ended),
            render: (val, _) => <RelativeTime date={val} />,
        },
    ];
}

function getDurationCol<T extends StepSummary>(): ColumnsType<T> {
    return [
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
}
