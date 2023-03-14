import React, { useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import useFetch from 'use-http';

import { sortByString } from './BaseTable';
import { BasePageTable } from './BasePageTable';
import { StepInfo } from '../api/Step';
import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from '../components/StatusIcon';
import { PageRequest, PageResponse } from '../api/Page';
import { noCacheOptions } from '../api/Api';
import { addWorkspace } from '../api/Session';
import { InitialPageSize } from '../api/config';
import { LoadingOrError } from './LoadingOrError';

interface StepInfoTableProps {
    workspaceId: string;
}

export function StepInfoTable({ workspaceId }: StepInfoTableProps) {
    const dataKey = 'id';
    const sortBy = 'start_time';
    const fetchRunsUrl = `/api/workspace/${workspaceId}/steps`;
    const { post, response, loading, error } = useFetch<PageResponse<StepInfo>>(
        fetchRunsUrl,
        noCacheOptions
    );

    const getData = async function (req: PageRequest) {
        if (!req.sort_by.length) {
            req.sort_by = sortBy;
        }
        await post('', { ...noCacheOptions, ...req });
        if (response.ok) {
            // if we were successful in loading this ws, add it to the recent list
            addWorkspace(atob(workspaceId));
        }
    };

    useEffect(() => {
        getData({
            current_page: 0,
            page_size: InitialPageSize,
            sort_by: sortBy,
            sort_descending: false,
        });
    }, []);

    const getColumns = (): ColumnsType<StepInfo> => {
        return [
            ...getStatusCol(),
            ...getIdCol(workspaceId),
            ...getStartedCol(),
            ...getEndedCol(),
            ...getDurationCol(),
        ];
    };

    return (
        <>
            <h4>Steps</h4>
            <LoadingOrError dataType="Steps" loading={loading} error={error} />
            {!error && response.data ? (
                <BasePageTable<StepInfo>
                    loading={loading}
                    dataKey={dataKey}
                    data={response.data.data}
                    dataTotal={response.data.total_items}
                    getData={getData}
                    getColumns={getColumns}
                />
            ) : null}
        </>
    );
}

function getStatusCol<T extends StepInfo>(): ColumnsType<T> {
    return [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            sorter: sortByString((item) => item.status),
            render: (val) => <StatusIconWithLabel status={val} />,
        },
    ];
}

function getIdCol<T extends StepInfo>(workspaceId: string): ColumnsType<T> {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'unique_id',
            width: 200,
            sorter: sortByString((item) => item.id),
            render: (val, obj) => (
                <a href={`/workspace/${workspaceId}/step/${btoa(obj.id)}`}>{val}</a>
            ),
        },
    ];
}

function getStartedCol<T extends StepInfo>(): ColumnsType<T> {
    return [
        {
            title: 'Started',
            dataIndex: 'started',
            key: 'start_time',
            width: 260,
            sorter: sortByString((item) => item.started),
            render: (val, _) => <RelativeTime date={val} />,
        },
    ];
}

function getEndedCol<T extends StepInfo>(): ColumnsType<T> {
    return [
        {
            title: 'Ended',
            dataIndex: 'ended',
            key: 'ended',
            width: 260,
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
            render: (_, obj) => <RelativeDuration start={obj.started} end={obj.ended} />,
        },
    ];
}
