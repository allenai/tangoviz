import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import { PageRequest } from '../api/Page';
import { InitialPageSize } from '../api/config';

interface Props<T> {
    loading: boolean;
    data: T[];
    dataTotal: number;
    getColumns: () => ColumnsType<T>;
    dataKey: keyof T;
    getData: (req: PageRequest) => void;
}

export function BasePageTable<T extends object>({
    loading,
    data,
    dataTotal,
    getColumns,
    dataKey,
    getData,
}: Props<T>) {
    const [columns, setColumns] = useState<ColumnsType<T>>([]);
    const [mainFilter, setMainFilter] = useState<string>();

    useEffect(() => {
        setColumns(getColumns());
    }, [getColumns]);

    // get info from table and pass to api
    const handleFilter = (value?: string) => {
        const req: PageRequest = {
            current_page: 0,
            page_size: InitialPageSize,
            sort_by: '', // gets added by subclass
            sort_descending: false,
            status: undefined,
            match: value,
        };
        getData(req);
    };

    // get info from table and pass to api
    const handleFilterSortPageChange = (
        pagination: TablePaginationConfig,
        _: Record<string, FilterValue | null>,
        sorter: SorterResult<T> | SorterResult<T>[]
    ) => {
        const req: PageRequest = {
            current_page: (pagination.current || 1) - 1, // api is 0 indexed
            page_size: pagination.pageSize || InitialPageSize,
            sort_by: '', // gets added by subclass
            sort_descending: false,
            status: undefined,
            match: mainFilter,
        };

        // only doing first one for now
        const firstSortVal = Array.isArray(sorter) ? sorter[0] : sorter;
        req.sort_by = firstSortVal.columnKey?.toString() || '';
        req.sort_descending = firstSortVal.order === 'descend';
        getData(req);
    };
    return (
        <Table<T>
            loading={loading}
            title={() => (
                <Input
                    size="small"
                    allowClear={true}
                    placeholder={`Filter by Name or ID...`}
                    value={mainFilter}
                    onChange={(e) => {
                        setMainFilter(e.target.value);
                        // if the use clicked clear, kick off a search
                        if (e.type === 'click') {
                            handleFilter(undefined);
                        }
                    }}
                    onPressEnter={(e) => {
                        handleFilter(e.currentTarget.value);
                    }}
                />
            )}
            rowKey={dataKey.toString()}
            dataSource={data}
            columns={columns}
            size="small"
            onChange={handleFilterSortPageChange}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: true,
                size: 'small',
                defaultPageSize: InitialPageSize,
                pageSizeOptions: [InitialPageSize, 20, 50],
                total: dataTotal,
            }}
            showSorterTooltip={false}
            scroll={{
                x: columns.reduce((total, val) => {
                    return total + Number(val.width || 0);
                }, 0),
            }}
        />
    );
}
