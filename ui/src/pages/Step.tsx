import React, { useEffect } from 'react';
import styled from 'styled-components';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';
import { Descriptions } from 'antd';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { Step as StepModel } from '../api/Step';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';
import { RelativeTime, RelativeDuration } from '../components/Formatters';
import { FileTree } from '../components/FileTree';
import { StatusIconWithLabel } from '../components/StatusIcon';

export const Step = () => {
    const { wsid, sid } = useParams<{ wsid: string; sid: string }>();
    const { get, response, loading, error } = useFetch<StepModel>(
        `/api/workspace/${wsid}/step/${sid}`,
        noCacheOptions
    );

    useEffect(() => {
        get();
    }, []);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} secondaryId={sid} />

            {loading ? 'Loading...' : null}
            {error ? `Error: ${error.message}}` : null}
            {!error && response.data ? (
                <>
                    <Descriptions size="small" title={<h1>Step Details</h1>} bordered>
                        <Descriptions.Item span={99} label="Status">
                            <StatusIconWithLabel status={response.data.status} />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Started">
                            <RelativeTime date={response.data.started} />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Ended">
                            <RelativeTime date={response.data.started} />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Duration">
                            <RelativeDuration
                                start={response.data.started}
                                end={response.data.ended}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Execution">
                            {<a href={response.data.executionURL}>{response.data.executionURL}</a>}
                        </Descriptions.Item>
                        <Descriptions.Item span={99} label="Logs">
                            {<a href={response.data.logURL}>{response.data.logURL}</a>}
                        </Descriptions.Item>
                    </Descriptions>

                    <h4>Artifacts</h4>
                    <Artifacts data={response.data.artifacts} wsid={wsid} />

                    <h4>Used in Runs</h4>
                    <RunSummaryTable workspaceId={wsid} data={response.data.runs}></RunSummaryTable>
                </>
            ) : null}
        </div>
    );
};

const Artifacts = styled(FileTree)`
    border: ${({ theme }) => `1px solid ${theme.palette.border.default}`};
    padding: ${({ theme }) => theme.spacing.xs};
`;
