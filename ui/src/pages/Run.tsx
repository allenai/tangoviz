import React, { useEffect, useCallback } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { RunStepInfoTable } from '../components/StepInfoTable';
import { Run as RunModel } from '../api/Run';
import { noCacheOptions } from '../api/Api';
import { useIntervalAsync, FetchInterval } from '../api/useIntervalAsync';
import { Breadcrumb } from '../components/Breadcrumb';
import { Flow } from '../components/Flow';
import { RunDetails } from '../components/RunDetails';

export const Run = () => {
    const { wsid, rid } = useParams<{ wsid: string; rid: string }>();
    const fetchUrl = `/api/workspace/${wsid}/run/${rid}`;
    const { get, response, loading, error } = useFetch<RunModel>(fetchUrl, noCacheOptions);
    const { get: refetch } = useFetch<RunModel>(fetchUrl, noCacheOptions);

    useEffect(() => {
        get();
    }, []);

    const refetchData = useCallback(async () => {
        if (response.data && !loading && !error) {
            refetch();
        }
    }, []);

    // poll the api to update ui on an interval
    useIntervalAsync(refetchData as any, FetchInterval);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} secondaryId={rid} />

            {loading ? 'Loading...' : null}
            {error ? `Error: ${error.message}}` : null}
            {!error && response.data ? (
                <>
                    <RunDetails run={response.data} />

                    <h4>Steps</h4>
                    <RunStepInfoTable
                        workspaceId={wsid}
                        data={response.data.runStepInfos}></RunStepInfoTable>

                    <h4>Dependency Graph</h4>
                    <ReactFlowProvider>
                        <Flow runStepInfos={response.data.runStepInfos} />
                    </ReactFlowProvider>
                </>
            ) : null}
        </div>
    );
};
