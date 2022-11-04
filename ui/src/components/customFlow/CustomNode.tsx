import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';
import { Collapse } from 'antd';

import { RunStepDetails } from '../RunStepDetails';
import { RunStepSummary } from '../../api/Step';
import { StatusIcon, StatusContainer, getColorIdFromStatus } from '../StatusIcon';

export interface CustomNodeData {
    runStepSummary: RunStepSummary;
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
        <Node runStepSummary={data.runStepSummary}>
            <Handle type="target" id="a" position={targetPosition} isConnectable={isConnectable} />

            <FullCollapse onChange={() => data.onExpand(data)}>
                <Collapse.Panel
                    header={
                        <StatusContainer>
                            <StatusIcon status={data.runStepSummary.status} />
                            {data.runStepSummary.name}
                        </StatusContainer>
                    }
                    key={data.runStepSummary.id}>
                    <RunStepDetails runStepSummary={data.runStepSummary} />
                </Collapse.Panel>
            </FullCollapse>

            <Handle type="source" id="c" position={sourcePosition} isConnectable={isConnectable} />
        </Node>
    );
};

const Node = styled.div<{ runStepSummary: RunStepSummary }>`
    width: 300px;
    max-height: 300px;
    outline: ${({ theme, runStepSummary }) =>
        `2px solid ${theme.color[getColorIdFromStatus(runStepSummary.status)]}`};

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
