import { Status } from './Status';
import { RunStepInfo } from './Step';

export interface RunSummary {
    name: string;
    status: Status;
    started?: string;
    ended?: string;
    stepStatus: string; // aggregated step status written by backend
}

export interface Run extends RunSummary {
    runStepInfos: RunStepInfo[];
}
