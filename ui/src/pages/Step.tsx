import React, { useEffect } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';
import { Descriptions } from 'antd';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { Step as StepModel } from '../api/Step';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';
import { RelativeTime, RelativeDuration } from '../components/Formatters';
import { FileTree } from '../components/FileTree';
import { StatusIcon } from '../components/StatusIcon';

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
                            <span>
                                <StatusIcon status={response.data.status} /> {response.data.status}
                            </span>
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

                    <h3>Artifacts</h3>
                    <FileTree data={response.data.artifacts} wsid={wsid} />

                    <h3>Used in Runs</h3>
                    <RunSummaryTable workspaceId={wsid} data={response.data.runs}></RunSummaryTable>
                </>
            ) : null}
        </div>
    );
};
