import React, { useEffect } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { StepSummaryTable } from '../components/StepSummaryTable';
import { Workspace as WorkspaceModel } from '../api/Workspace';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';

export const Workspace = () => {
    const { wsid } = useParams<{ wsid: string }>();
    const { get, response, loading, error } = useFetch<WorkspaceModel>(
        `/api/workspace/${wsid}`,
        noCacheOptions
    );

    useEffect(() => {
        get();
    }, []);

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
                        data={response.data.allSteps}></StepSummaryTable>
                </>
            ) : null}
        </div>
    );
};
