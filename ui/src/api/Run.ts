import { Status } from './Status';
import { RunStepSummary } from './Step';

export interface RunSummary {
    name: string;
    status: Status;
    started?: string;
    ended?: string;
    stepStatus: string; // aggregated step status written by backend
}

export interface Run extends RunSummary {
    runStepSummaries: RunStepSummary[];
}
