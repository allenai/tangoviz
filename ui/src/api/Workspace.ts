import { RunSummary } from './Run';
import { StepInfo } from './Step';

export interface Workspace {
    url: string; // id
    runs: RunSummary[];
    allStepInfos: StepInfo[];
}
