import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';
import { Collapse } from 'antd';

import { RunStepDetails } from '../RunStepDetails';
import { RunStepInfo } from '../../api/Step';
import { StatusIcon, StatusContainer, getColorIdFromStatus } from '../StatusIcon';

export interface CustomNodeData {
    runStepInfo: RunStepInfo;
    onExpand: (d: CustomNodeData) => void;
    isExpanded?: boolean;
}

interface Props extends NodeProps {
    data: CustomNodeData;
}

export const CustomNode = ({
    data,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
    isConnectable,
}: Props) => {
    return (
        <Node runStepInfo={data.runStepInfo}>
            <Handle type="target" id="a" position={targetPosition} isConnectable={isConnectable} />

            <FullCollapse onChange={() => data.onExpand(data)}>
                <Collapse.Panel
                    header={
                        <StatusContainer>
                            <StatusIcon status={data.runStepInfo.status} />
                            {data.runStepInfo.name}
                        </StatusContainer>
                    }
                    key={data.runStepInfo.id}>
                    <RunStepDetails runStepInfo={data.runStepInfo} />
                </Collapse.Panel>
            </FullCollapse>

            <Handle type="source" id="c" position={sourcePosition} isConnectable={isConnectable} />
        </Node>
    );
};

const Node = styled.div<{ runStepInfo: RunStepInfo }>`
    width: 300px;
    max-height: 300px;
    outline: ${({ theme, runStepInfo }) =>
        `2px solid ${theme.color[getColorIdFromStatus(runStepInfo.status)]}`};

    filter: drop-shadow(4px 8px 3px rgba(0, 0, 0, 0.1));
    &:hover {
        box-sizing: border-box;
        outline-width: 4px;
    }
`;

const FullCollapse = styled(Collapse)`
    background: white;
    .ant-collapse-content > .ant-collapse-content-box {
        padding: 0;
    }
`;
