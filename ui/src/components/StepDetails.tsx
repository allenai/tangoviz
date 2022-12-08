import React from 'react';
import { Descriptions } from 'antd';

import { RelativeTime, RelativeDuration } from './Formatters';
import { StatusIconWithLabel } from '../components/StatusIcon';
import { Step } from '../api/Step';

interface Props {
    step: Step;
}

export function StepDetails({ step }: Props) {
    return (
        <Descriptions size="small" title={<h4>Step Details</h4>} bordered>
            <Descriptions.Item span={3} label="Status">
                <StatusIconWithLabel status={step.status} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Started">
                <RelativeTime date={step.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Ended">
                <RelativeTime date={step.started} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Duration">
                <RelativeDuration start={step.started} end={step.ended} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Results">
                {<a href={step.results}>{step.results}</a>}
            </Descriptions.Item>
        </Descriptions>
    );
}
