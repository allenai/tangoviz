from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field
from tango.common.util import local_timezone
from tango.step_info import StepInfo as TangoStepInfo
from tango.step_info import StepState as StepStatus
from tango.workspace import Run as TangoRun
from tango.workspace import RunSort, StepInfoSort

from .util import ordered_step_infos

__all__ = [
    "RunStatus",
    "RunInfo",
    "PartialRunInfo",
    "StepStatus",
    "StepInfo",
    "GetWorkspaceOutput",
    "GetWorkspaceRunsOutput",
    "GetWorkspaceStepsOutput",
    "RunStepInfo",
    "GetRunOutput",
    "RunPageData",
    "StepPageData",
    "RunSort",
    "StepInfoSort",
    "GetStepOutput",
]


class StrEnum(str, Enum):
    def __str__(self) -> str:
        return self.value


class RunStatus(StrEnum):
    INCOMPLETE = "incomplete"
    """The run hasn't started or was stopped early."""

    RUNNING = "running"
    """Some steps are still running."""

    COMPLETED = "completed"
    """All cacheable steps completed successfully."""

    FAILED = "failed"
    """At least one step failed."""

    UNCACHEABLE = "uncacheable"
    """All steps are uncacheable, so there is no status."""


class PartialRunInfo(BaseModel):
    name: str
    started: Optional[datetime]


class RunInfo(BaseModel):
    name: str
    status: RunStatus
    stepStatus: str
    started: datetime
    ended: Optional[datetime] = None

    @classmethod
    def from_tango_run(cls, run: TangoRun) -> RunInfo:
        ended: Optional[datetime] = None
        running = 0
        failed = 0
        completed = 0
        incomplete = 0
        uncacheable = 0
        for step_info in run.steps.values():
            if step_info.state == StepStatus.RUNNING:
                running += 1
            elif step_info.state == StepStatus.FAILED:
                failed += 1
            elif step_info.state == StepStatus.COMPLETED:
                completed += 1
            elif step_info.state == StepStatus.INCOMPLETE:
                incomplete += 1
            elif step_info.state == StepStatus.UNCACHEABLE:
                uncacheable += 1
            if step_info.end_time_local is not None:
                if ended is not None:
                    ended = max(ended, step_info.end_time_local)
                else:
                    ended = step_info.end_time_local

        step_status: list[str] = []
        if running > 0:
            step_status.append(f"{running} running")
        if failed > 0:
            step_status.append(f"{failed} failed")
        if completed > 0:
            step_status.append(f"{completed} completed")
        if incomplete > 0:
            step_status.append(f"{incomplete} incomplete")

        status: RunStatus
        if failed > 0:
            status = RunStatus.RUNNING
        elif running > 0:
            status = RunStatus.RUNNING
        elif incomplete > 0:
            status = RunStatus.INCOMPLETE
        elif completed > 0:
            status = RunStatus.COMPLETED
        elif uncacheable > 0:
            status = RunStatus.UNCACHEABLE
        else:
            status = RunStatus.COMPLETED

        if incomplete > 0 or running > 0:
            ended = None

        return cls(
            name=run.name,
            status=status,
            stepStatus=", ".join(step_status),
            started=run.start_date.astimezone(local_timezone()),
            ended=ended,
        )


class StepInfo(BaseModel):
    id: str
    status: StepStatus
    started: Optional[datetime] = None
    ended: Optional[datetime] = None
    results: Optional[str] = None
    dependencies: list[str] = Field(default_factory=list)

    @classmethod
    def from_tango_step_info(cls, step_info: TangoStepInfo) -> StepInfo:
        return cls(
            id=step_info.unique_id,
            status=step_info.state.value.lower(),
            started=step_info.start_time_local,
            ended=step_info.end_time_local,
            results=step_info.result_location,
            dependencies=list(step_info.dependencies),
        )


class GetWorkspaceOutput(BaseModel):
    """
    Output type for the workspace endpoint "/api/workspace/{wsid}".
    """

    url: str


T = TypeVar("T")


class PageData(BaseModel, Generic[T]):
    current_page: int
    page_size: int
    sort_by: T
    sort_descending: bool = True
    match: Optional[str] = None
    """
    A search string to filter runs/steps. Only runs/steps with a name that contains this string
    will be returned.
    """


class RunPageData(PageData[RunSort]):
    sort_by: RunSort


class StepPageData(PageData[StepInfoSort]):
    sort_by: StepInfoSort
    status: StepStatus


class GetWorkspaceRunsOutput(RunPageData):
    """
    Output type for the runs endpoint "/api/workspace/{wsid}/runs".
    """

    data: List[PartialRunInfo]
    total_items: int


class GetWorkspaceStepsOutput(StepPageData):
    """
    Output type for the steps endpoint "/api/workspace/{wsid}/steps".
    """

    data: List[StepInfo]
    total_items: int


class RunStepInfo(StepInfo):
    name: str
    order: int


class GetRunOutput(RunInfo):
    """
    Output type for the run endpoint "/api/workspace/{wsid}/run/{rid}".
    """

    runStepInfos: list[RunStepInfo]

    @classmethod
    def from_tango_run(cls, run: TangoRun) -> GetRunOutput:
        run_step_infos = [
            RunStepInfo(
                name=step_info.step_name,  # type: ignore
                order=i + 1,
                **StepInfo.from_tango_step_info(step_info).dict(),
            )
            for i, step_info in enumerate(ordered_step_infos(run.steps.values()))
        ]
        return cls(
            **RunInfo.from_tango_run(run).dict(),
            runStepInfos=run_step_infos,
        )


class GetStepOutput(StepInfo):
    """
    Output type for the step endpoint "/api/workspace/{wsid}/step/{sid}".
    """
