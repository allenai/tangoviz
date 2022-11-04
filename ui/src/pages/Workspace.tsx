import React, { useEffect, useCallback } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { StepSummaryTable } from '../components/StepSummaryTable';
import { Workspace as WorkspaceModel } from '../api/Workspace';
import { noCacheOptions } from '../api/Api';
import { useIntervalAsync, FetchInterval } from '../api/useIntervalAsync';
import { Breadcrumb } from '../components/Breadcrumb';
import { addWorkspace } from '../api/Session';

export const Workspace = () => {
    const { wsid } = useParams<{ wsid: string }>();
    const fetchUrl = `/api/workspace/${wsid}`;
    const { get, response, loading, error } = useFetch<WorkspaceModel>(fetchUrl, noCacheOptions);
    const { get: refetch } = useFetch<WorkspaceModel>(fetchUrl, noCacheOptions);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        await get();
        if (response.ok) {
            // if we were successful in loading this ws, add it to the recent list
            addWorkspace(atob(wsid));
        }
    }

    const refetchData = useCallback(async () => {
        if (response.data && !loading && !error) {
            refetch();
        }
    }, []);

    // poll the api to update ui on an interval
    useIntervalAsync(refetchData as any, FetchInterval);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} />

            <h1>Workspace Details</h1>

            {loading ? 'Loading...' : null}
            {error ? `Error: ${error.message}}` : null}
            {!error && response.data ? (
                <>
                    <h4>Runs</h4>
                    <RunSummaryTable workspaceId={wsid} data={response.data.runs}></RunSummaryTable>

                    <h4>Steps</h4>
                    <StepSummaryTable
                        workspaceId={wsid}
                        data={response.data.allStepSummaries}></StepSummaryTable>
                </>
            ) : null}
        </div>
    );
};
