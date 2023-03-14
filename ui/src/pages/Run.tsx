import React, { useEffect } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { RunStepInfoTable } from '../components/RunStepInfoTable';
import { Run as RunModel } from '../api/Run';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';
import { Flow } from '../components/Flow';
import { RunDetails } from '../components/RunDetails';
import { LoadingOrError } from '../components/LoadingOrError';

export const Run = () => {
    const { wsid, rid } = useParams<{ wsid: string; rid: string }>();
    const fetchUrl = `/api/workspace/${wsid}/run/${rid}`;
    const { get, response, loading, error } = useFetch<RunModel>(fetchUrl, noCacheOptions);

    useEffect(() => {
        get();
    }, []);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} secondaryId={rid} />

            <LoadingOrError dataType="Run" loading={loading} error={error} />
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
