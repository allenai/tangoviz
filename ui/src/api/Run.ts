import { Status } from './Status';
import { RunStepInfo } from './Step';

export interface RunSummary {
    name: string;
    started?: string;
}

export interface Run extends RunSummary {
    status: Status;
    runStepInfos: RunStepInfo[];
    ended?: string;
    stepStatus: string; // aggregated step status written by backend
}
