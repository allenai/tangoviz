import { Status } from './Status';
import { RunSummary } from './Run';

export interface StepInfo {
    id: string;
    status: Status;
    started?: string;
    ended?: string;
    executionURL?: string;
    dependencies: string[]; // ids of dependent steps
    logURL: string;
}

export interface RunStepInfo extends StepInfo {
    name: string;
    order: number;
}

export interface Step extends StepInfo {
    runs: RunSummary[];
    artifacts: { [file: string]: number };
}
