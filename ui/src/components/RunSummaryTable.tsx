import React, { useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import useFetch from 'use-http';

import { sortByString } from './BaseTable';
import { BasePageTable } from './BasePageTable';
import { RunSummary } from '../api/Run';
import { RelativeTime } from './Formatters';
import { PageRequest, PageResponse } from '../api/Page';
import { noCacheOptions } from '../api/Api';
import { addWorkspace } from '../api/Session';
import { InitialPageSize } from '../api/config';
import { LoadingOrError } from './LoadingOrError';

interface RunSummaryTableProps {
    workspaceId: string;
}

export function RunSummaryTable({ workspaceId }: RunSummaryTableProps) {
    const dataKey = 'name';
    const sortBy = 'name';
    const fetchRunsUrl = `/api/workspace/${workspaceId}/runs`;
    const { post, response, loading, error } = useFetch<PageResponse<RunSummary>>(
        fetchRunsUrl,
        noCacheOptions
    );

    const getData = async function (req: PageRequest) {
        if (!req.sort_by.length) {
            req.sort_by = sortBy;
        }
        await post(req);
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

    const getColumns = (): ColumnsType<RunSummary> => {
        return [...getNameCol(workspaceId), ...getStartedCol()];
    };

    return (
        <>
            <h4>Runs</h4>
            <LoadingOrError dataType="Runs" loading={loading} error={error} />
            {!error && response.data ? (
                <BasePageTable<RunSummary>
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

function getNameCol<T extends RunSummary>(workspaceId: string): ColumnsType<T> {
    return [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: sortByString((item) => item.name),
            render: (val, obj) => (
                <a href={`/workspace/${workspaceId}/run/${btoa(obj.name)}`}>{val}</a>
            ),
        },
    ];
}

function getStartedCol<T extends RunSummary>(): ColumnsType<T> {
    return [
        {
            title: 'Started',
            dataIndex: 'started',
            key: 'start_date',
            width: 260,
            sorter: sortByString((item) => item.started),
            render: (val, _) => <RelativeTime date={val} />,
        },
    ];
}
