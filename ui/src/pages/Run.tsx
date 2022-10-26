import React, { useEffect } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';
import { Descriptions } from 'antd';

import { StepSummaryTable } from '../components/StepSummaryTable';
import { Run as RunModel } from '../api/Run';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';
import { RelativeTime, RelativeDuration } from '../components/Formatters';
import { StatusIcon } from '../components/StatusIcon';

export const Run = () => {
    const { wsid, rid } = useParams<{ wsid: string; rid: string }>();
    const { get, response, loading, error } = useFetch<RunModel>(
        `/api/workspace/${wsid}/run/${rid}`,
        noCacheOptions
    );

    useEffect(() => {
        get();
    }, []);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} secondaryId={rid} />

            {loading ? 'Loading...' : null}
            {error ? `Error: ${error.message}}` : null}
            {!error && response.data ? (
                <>
                    <Descriptions size="small" title={<h1>Run Details</h1>} bordered>
                        <Descriptions.Item span={99} label="Status">
                            <span>
                                <StatusIcon status={response.data.status} /> {response.data.status}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Step Status">
                            {response.data.stepStatus}
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Started">
                            <RelativeTime date={response.data.started} />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Ended">
                            <RelativeTime date={response.data.ended} />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Duration">
                            <RelativeDuration
                                start={response.data.started}
                                end={response.data.ended}
                            />
                        </Descriptions.Item>
                    </Descriptions>

                    <h3>Steps</h3>
                    <StepSummaryTable
                        workspaceId={wsid}
                        data={response.data.steps}></StepSummaryTable>
                </>
            ) : null}
        </div>
    );
};
