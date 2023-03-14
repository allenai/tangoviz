import React from 'react';
import { useParams } from 'react-router-dom';

import { RunSummaryTable } from '../components/RunSummaryTable';
import { StepInfoTable } from '../components/StepInfoTable';
import { Breadcrumb } from '../components/Breadcrumb';

export const Workspace = () => {
    const { wsid } = useParams<{ wsid: string }>();

    return (
        <div>
            <Breadcrumb workspaceId={wsid} />

            <h1>Workspace Details</h1>
            <RunSummaryTable workspaceId={wsid}></RunSummaryTable>
            <StepInfoTable workspaceId={wsid}></StepInfoTable>
        </div>
    );
};
