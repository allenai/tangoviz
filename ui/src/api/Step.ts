import { Status } from './Status';

export interface StepInfo {
    id: string;
    status: Status;
    started?: string;
    ended?: string;
    results?: string;
    dependencies: string[]; // ids of dependent steps
}

export interface RunStepInfo extends StepInfo {
    name: string;
    order: number;
}
