import React, { useEffect } from 'react';
import useFetch from 'use-http';
import { useParams } from 'react-router-dom';

import { StepInfo } from '../api/Step';
import { noCacheOptions } from '../api/Api';
import { Breadcrumb } from '../components/Breadcrumb';
import { StepDetails } from '../components/StepDetails';
import { LoadingOrError } from '../components/LoadingOrError';

export const Step = () => {
    const { wsid, sid } = useParams<{ wsid: string; sid: string }>();
    const fetchUrl = `/api/workspace/${wsid}/step/${sid}`;
    const { get, response, loading, error } = useFetch<StepInfo>(fetchUrl, noCacheOptions);

    useEffect(() => {
        get();
    }, []);

    return (
        <div>
            <Breadcrumb workspaceId={wsid} secondaryId={sid} />

            <LoadingOrError dataType="Step" loading={loading} error={error} />
            {!error && response.data ? <StepDetails stepInfo={response.data} /> : null}
        </div>
    );
};
