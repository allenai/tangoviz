import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { AutoComplete, Input, Form, List } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

export const Home = () => {
    const history = useHistory();
    const [workspaceUrlOptions, setWorkspaceUrlOptions] = useState<{ value: string }[]>([]);

    const onSearch = (searchText: string) => {
        setWorkspaceUrlOptions(!searchText ? [] : [{ value: searchText }]);
    };

    const onSelect = (searchText: string) => {
        history.push(`/workspace/${btoa(searchText)}`);
    };

    // todo: grab these from session
    const recentWorkspaces = [
        'beaker://ai2/task-complexity',
        'wandb://allennlp/catwalk',
        'wandb://dirkgr/quark',
        'gcs://catwalk',
    ];

    return (
        <div>
            <h1>Tango Reporting</h1>

            <Form.Item extra="e.g. beaker://…, wandb://…, gcs://…">
                <AutoComplete
                    options={workspaceUrlOptions}
                    dropdownMatchSelectWidth={252}
                    style={{ width: '100%' }}
                    onSelect={(data: string) => onSelect(data)}
                    onSearch={onSearch}>
                    <InputSearchFix
                        size="large"
                        placeholder="Enter a Workspace URL"
                        enterButton={<CaretRightOutlined />}
                    />
                </AutoComplete>
            </Form.Item>

            <List
                size="small"
                header={<h4>Recent Workspaces</h4>}
                dataSource={recentWorkspaces}
                renderItem={(ulr) => (
                    <List.Item>
                        <a href={`/workspace/${btoa(ulr)}`}>{ulr}</a>
                    </List.Item>
                )}
            />
        </div>
    );
};

const InputSearchFix = styled(Input.Search)`
    &.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child {
        left: unset;
    }
`;
