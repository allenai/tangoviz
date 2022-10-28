import { Status } from './Status';
import { RunSummary } from './Run';

export interface StepSummary {
    id: string;
    status: Status;
    started?: string;
    ended?: string;
    executionURL?: string;
    dependencies: string[]; // ids of dependent steps
}

export interface RunStepSummary extends StepSummary {
    name: string;
    order: number;
}

export interface Step extends StepSummary {
    runs: RunSummary[];
    artifacts: { [file: string]: number };
    logURL: string;
}
