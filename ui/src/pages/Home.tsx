import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Input, Form, List } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

export const Home = () => {
    const history = useHistory();

    const onSelect = (searchText: string) => {
        history.push(`/workspace/${btoa(searchText)}`);
    };

    // todo: grab these from session
    const recentWorkspaces: string[] = [
        'beaker://ai2/task-complexity',
        'wandb://allennlp/catwalk',
        'wandb://dirkgr/quark',
        'gcs://catwalk',
    ];

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

            {recentWorkspaces.length ? (
                <List
                    size="small"
                    header={<h4>Recent Workspaces</h4>}
                    dataSource={recentWorkspaces}
                    pagination={{
                        hideOnSinglePage: true,
                        size: 'small',
                        defaultPageSize: 6,
                    }}
                    renderItem={(ulr) => (
                        <List.Item>
                            <a href={`/workspace/${btoa(ulr)}`}>{ulr}</a>
                        </List.Item>
                    )}
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
