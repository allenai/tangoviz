import React from 'react';
import styled from 'styled-components';
import { ColumnsType } from 'antd/es/table';
import { List } from 'antd';
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
import { StepInfo, RunStepInfo } from '../api/Step';
import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from '../components/StatusIcon';
import { StatusArray } from '../api/Status';

dayjs.extend(isBetween);

interface Props<T> {
    data: T[];
    workspaceId: string;
}

export function StepInfoTable({ data, workspaceId }: Props<StepInfo>) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<StepInfo>,
        getSelectFilterBy: GetSelectFilterByType<StepInfo>,
        getDateFilterBy: GetDateFilterByType<StepInfo>
    ): ColumnsType<StepInfo> => {
        return [
            ...getStatusCol(getSelectFilterBy),
            ...getIdCol(getInputFilterBy, workspaceId),
            ...getStartedCol(getDateFilterBy),
            ...getEndedCol(getDateFilterBy),
            ...getDurationCol(),
        ];
    };

    return <BaseTable<StepInfo> dataKey="id" data={data} getColumns={getColumns} />;
}

export function RunStepInfoTable({ data, workspaceId }: Props<RunStepInfo>) {
    const getColumns = (
        getInputFilterBy: GetInputFilterByType<RunStepInfo>,
        getSelectFilterBy: GetSelectFilterByType<RunStepInfo>,
        getDateFilterBy: GetDateFilterByType<RunStepInfo>
    ): ColumnsType<RunStepInfo> => {
        return [
            ...getStatusCol(getSelectFilterBy),
            ...getIdCol(getInputFilterBy, workspaceId),
            ...getNameCol(getInputFilterBy),
            ...getOrderCol(getInputFilterBy),
            ...getDependenciesCol(getInputFilterBy, workspaceId),
            ...getStartedCol(getDateFilterBy),
            ...getEndedCol(getDateFilterBy),
            ...getDurationCol<RunStepInfo>(),
        ];
    };

    return <BaseTable<RunStepInfo> dataKey="id" data={data} getColumns={getColumns} />;
}

function getStatusCol<T extends StepInfo>(
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

function getIdCol<T extends StepInfo>(
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

function getNameCol<T extends RunStepInfo>(
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

function getOrderCol<T extends RunStepInfo>(
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

function getDependenciesCol<T extends RunStepInfo>(
    getInputFilterBy: GetInputFilterByType<T>,
    workspaceId: string
): ColumnsType<T> {
    return [
        {
            title: getInputFilterBy('Dependencies', (value: string, records: T[]) => {
                return records.filter((record) => {
                    return record.dependencies.includes(value.toLowerCase());
                });
            }),
            dataIndex: 'dependencies',
            key: 'dependencies',
            width: 100,
            render: (val, _) => (
                <ScrollDiv>
                    {val.length ? (
                        <List
                            size="small"
                            dataSource={val}
                            pagination={false}
                            renderItem={(d: string) => {
                                return (
                                    <List.Item>
                                        <a href={`/workspace/${workspaceId}/step/${btoa(d)}`}>
                                            {d}
                                        </a>
                                    </List.Item>
                                );
                            }}
                        />
                    ) : null}
                </ScrollDiv>
            ),
        },
    ];
}

function getStartedCol<T extends StepInfo>(
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

function getEndedCol<T extends StepInfo>(
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

function getDurationCol<T extends StepInfo>(): ColumnsType<T> {
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

const ScrollDiv = styled.div`
    max-height: 122px;
    overflow-y: auto;
`;
