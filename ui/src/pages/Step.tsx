import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { Step as StepModel } from '../api/Step';
import { noCacheOptions } from '../api/Api';
import { useIntervalAsync, FetchInterval } from '../api/useIntervalAsync';
import { Breadcrumb } from '../components/Breadcrumb';
import { StepDetails } from '../components/StepDetails';

export const Step = () => {
    const { wsid, sid } = useParams<{ wsid: string; sid: string }>();
    const fetchUrl = `/api/workspace/${wsid}/step/${sid}`;
    const { get, response, loading, error } = useFetch<StepModel>(fetchUrl, noCacheOptions);
    const { get: refetch } = useFetch<StepModel>(fetchUrl, noCacheOptions);

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
            <Breadcrumb workspaceId={wsid} secondaryId={sid} />

            {loading ? 'Loading...' : null}
            {error ? `Error: ${error.message}}` : null}
            {!error && response.data ? (
                <>
                    <StepDetails step={response.data} />

                    <h4>Used in Runs</h4>
                    <RunSummaryTable workspaceId={wsid} data={response.data.runs}></RunSummaryTable>
                </>
            ) : null}
        </div>
    );
};
