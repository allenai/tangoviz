import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Input, Form, List, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

import { UserSessionData, getUserSessionData, removeWorkspace } from '../api/Session';

export const Home = () => {
    const [userSessionData, setUserSessionData] = useState<UserSessionData>();
    const history = useHistory();

    useEffect(() => {
        setUserSessionData(getUserSessionData());
    }, []);

    const onSelect = (searchText: string) => {
        history.push(`/workspace/${btoa(searchText)}`);
    };

    const removeWorkspaceAndReload = (wsid: string) => {
        removeWorkspace(wsid);
        setUserSessionData(getUserSessionData());
    };

    return (
        <div>
            <h1>Tango Workspaces</h1>

            <p>
                AI2 Tango allows you to build machine learning experiments out of steps that can be
                reused and repeated. Users can write their own steps simply by wrapping common
                Python functions. Tango also comes with a library of pre-built steps for training
                models, working with datasets, and running evaluations. It is integrated with
                popular tools like the Huggingface transformers library, PyTorch Lightning, and
                others.
            </p>
            <p>
                Tango’s built-in mechanism for storing and retrieving results makes sure that
                researchers can stay flexible when pursuing another idea. No work is duplicated,
                past results can be found easily, and the way a result was obtained is stored along
                with the result itself. For more info, checkout the{' '}
                <a target="_blank" href="https://github.com/allenai/tango" rel="noreferrer">
                    Code
                </a>
                , the{' '}
                <a
                    target="_blank"
                    href="https://ai2-tango.readthedocs.io/en/latest/"
                    rel="noreferrer">
                    Documentation
                </a>
                , or the{' '}
                <a target="_blank" href="https://pypi.org/project/ai2-tango/" rel="noreferrer">
                    PyPi Project
                </a>
                .
            </p>
            <p>To view a workspace, enter its URL below.</p>

            <Form.Item extra="e.g. beaker://…, wandb://…, gcs://…">
                <InputSearchFix
                    size="large"
                    placeholder="Enter a Workspace URL"
                    enterButton={<CaretRightOutlined />}
                    style={{ width: '100%' }}
                    onSearch={(data: string) => onSelect(data)}
                />
            </Form.Item>

            {userSessionData?.recentWorkspaces.length ? (
                <List
                    size="small"
                    header={<h4>Recent Workspaces</h4>}
                    dataSource={userSessionData?.recentWorkspaces}
                    pagination={{
                        hideOnSinglePage: true,
                        size: 'small',
                        defaultPageSize: 6,
                    }}
                    renderItem={(url) => {
                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        key={url}
                                        type="link"
                                        onClick={() => removeWorkspaceAndReload(url)}>
                                        Remove
                                    </Button>,
                                ]}>
                                <a href={`/workspace/${btoa(url)}`}>{url}</a>
                            </List.Item>
                        );
                    }}
                />
            ) : null}
        </div>
    );
};

const InputSearchFix = styled(Input.Search)`
    &.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child {
        left: unset;
    }
`;
