import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';

export type GetInputFilterByType<T> = (
    id: string,
    filter: (value: string, records: T[]) => T[]
) => JSX.Element;

export type GetSelectFilterByType<T> = (
    id: string,
    filter: (value: string, records: T[]) => T[],
    options: string[]
) => JSX.Element;

interface Props<T> {
    data: T[];
    getColumns: (
        getInputFilterBy: GetInputFilterByType<T>,
        getSelectFilterBy: GetSelectFilterByType<T>
    ) => ColumnsType<T>;
    dataKey: keyof T;
}

export function sortByString<T>(dataValueGetterFn: (u: T) => string | undefined) {
    return (a: T, b: T) => (dataValueGetterFn(a) || '').localeCompare(dataValueGetterFn(b) || '');
}

export function sortByNumber<T>(dataValueGetterFn: (u: T) => number | undefined) {
    return (a: T, b: T) => (dataValueGetterFn(a) || 0) - (dataValueGetterFn(b) || 0);
}

export function BaseTable<T extends object>({ data, getColumns, dataKey }: Props<T>) {
    const [filteredSummaries, setFilteredSummaries] = useState<T[]>(data);
    const [activeFilters, setActiveFilters] = useState<{
        [id: string]: (records: T[]) => T[];
    }>({});
    const [columns, setColumns] = useState<ColumnsType<T>>([]);

    useEffect(() => {
        setColumns(getColumns(getInputFilterBy, getSelectFilterBy));
    }, [getColumns]);

    // returns an input box that when typed in saves a specific filter to the map of active filters
    const getInputFilterBy: GetInputFilterByType<T> = (
        id: string,
        filter: (value: string, records: T[]) => T[]
    ) => {
        return (
            <FilterInput
                size="small"
                allowClear={true}
                placeholder={id}
                onChange={(e) => {
                    const currValue = e.target.value;
                    activeFilters[id] = (records: T[]) => filter(currValue, records);
                    setActiveFilters(activeFilters);
                    filterDatasource(activeFilters);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            />
        );
    };

    // same as above, but displays a dropdown (select)
    const getSelectFilterBy: GetSelectFilterByType<T> = (
        id: string,
        filter: (value: string, records: T[]) => T[],
        options: string[]
    ) => {
        return (
            <FilterSelect
                size="small"
                placeholder={id}
                onChange={(val) => {
                    const currValue = val as string;
                    activeFilters[id] = (records: T[]) => filter(currValue, records);
                    setActiveFilters(activeFilters);
                    filterDatasource(activeFilters);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <Select.Option value={''}>{`Any ${id}`}</Select.Option>
                {options.map((o) => (
                    <Select.Option key={o} value={o}>
                        {o}
                    </Select.Option>
                ))}
            </FilterSelect>
        );
    };

    // walks all active filters and applies each of them to the Summaries list to arrive at new filtered Summaries
    const filterDatasource = (filters: { [id: string]: (records: T[]) => T[] }) => {
        let filteredData = data;
        Object.values(filters).forEach((f) => (filteredData = f(filteredData)));
        setFilteredSummaries(filteredData);
    };

    return (
        <Table<T>
            rowKey={dataKey.toString()}
            dataSource={filteredSummaries}
            columns={columns}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: true,
                size: 'small',
                defaultPageSize: 10,
                pageSizeOptions: [10, 20, 100, 500],
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

const FilterInput = styled(Input)`
    width: ${({ theme }) => `calc(100% - ${theme.spacing.xs})`};
`;

const FilterSelect = styled(Select)`
    width: ${({ theme }) => `calc(100% - ${theme.spacing.xs})`};
`;
