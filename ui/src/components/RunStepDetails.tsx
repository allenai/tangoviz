import React from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';

import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from './StatusIcon';
import { RunStepSummary } from '../api/Step';

interface Props {
    runStepSummary: RunStepSummary;
}

export function RunStepDetails({ runStepSummary }: Props) {
    return (
        <OverflowDescription size="small" bordered>
            <Descriptions.Item span={3} label="Status">
                <StatusIconWithLabel status={runStepSummary.status} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Started">
                <RelativeTime date={runStepSummary.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Ended">
                <RelativeTime date={runStepSummary.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Duration">
                <RelativeDuration start={runStepSummary.started} end={runStepSummary.ended} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Execution">
                {<a href={runStepSummary.executionURL}>{runStepSummary.executionURL}</a>}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Logs">
                {<a href={runStepSummary.logURL}>{runStepSummary.logURL}</a>}
            </Descriptions.Item>
        </OverflowDescription>
    );
}

const OverflowDescription = styled(Descriptions)`
    max-height: 200px;
    overflow-y: scroll;
`;
