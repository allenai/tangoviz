import { Status } from './Status';
import { RunSummary } from './Run';

export interface StepSummary {
    id: string;
    atomicStepId: string;
    name: string;
    status: Status;
    started?: string;
    ended?: string;
    executionURL?: string;
}

export interface Step extends StepSummary {
    runs: RunSummary[];
    artifacts: { [file: string]: number };
    logURL: string;
}
