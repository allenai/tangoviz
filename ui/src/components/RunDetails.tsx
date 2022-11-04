import React from 'react';
import { Descriptions } from 'antd';

import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from './StatusIcon';
import { Run } from '../api/Run';

interface Props {
    run: Run;
}

export function RunDetails({ run }: Props) {
    return (
        <Descriptions size="small" title={<h1>Run Details</h1>} bordered>
            <Descriptions.Item span={3} label="Status">
                <StatusIconWithLabel status={run.status} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Step Status">
                {run.stepStatus}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Started">
                <RelativeTime date={run.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Ended">
                <RelativeTime date={run.ended} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Duration">
                <RelativeDuration start={run.started} end={run.ended} />
            </Descriptions.Item>
        </Descriptions>
    );
}
