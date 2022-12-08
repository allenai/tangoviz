import React from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';

import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from './StatusIcon';
import { RunStepInfo } from '../api/Step';

interface Props {
    runStepInfo: RunStepInfo;
}

export function RunStepDetails({ runStepInfo }: Props) {
    return (
        <OverflowDescription size="small" bordered>
            <Descriptions.Item span={3} label="Status">
                <StatusIconWithLabel status={runStepInfo.status} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Started">
                <RelativeTime date={runStepInfo.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Ended">
                <RelativeTime date={runStepInfo.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Duration">
                <RelativeDuration start={runStepInfo.started} end={runStepInfo.ended} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Results">
                {<a href={runStepInfo.results}>{runStepInfo.results}</a>}
            </Descriptions.Item>
        </OverflowDescription>
    );
}

const OverflowDescription = styled(Descriptions)`
    max-height: 200px;
    overflow-y: scroll;
`;
