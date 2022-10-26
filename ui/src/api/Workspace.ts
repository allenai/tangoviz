import { RunSummary } from './Run';
import { StepSummary } from './Step';

export interface Workspace {
    url: string; // id
    runs: RunSummary[];
    allSteps: StepSummary[];
}
