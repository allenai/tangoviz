from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field
from tango.common.util import local_timezone
from tango.step_info import StepInfo as TangoStepInfo
from tango.step_info import StepState as TangoStepState
from tango.workspace import Run as TangoRun

from .util import ordered_step_infos

__all__ = [
    "RunStatus",
    "RunInfo",
    "StepStatus",
    "StepInfo",
    "GetWorkspaceOutput",
    "RunStepInfo",
    "GetRunOutput",
    "GetStepOutput",
]


class StrEnum(str, Enum):
    def __str__(self) -> str:
        return self.value


class RunStatus(StrEnum):
    completed = "completed"
    failed = "failed"
    running = "running"


class RunInfo(BaseModel):
    name: str
    status: RunStatus
    stepStatus: str
    started: datetime
    # TODO: remove this? We don't have an end date for runs in Tango. We could try
    # to infer the end time but that could get messy.
    ended: Optional[datetime] = None

    @classmethod
    def from_tango_run(cls, run: TangoRun) -> RunInfo:
        status = RunStatus.completed
        running = 0
        failed = 0
        completed = 0
        incomplete = 0
        for step_info in run.steps.values():
            if step_info.state == TangoStepState.RUNNING:
                running += 1
            elif step_info.state == TangoStepState.FAILED:
                failed += 1
            elif step_info.state == TangoStepState.COMPLETED:
                completed += 1
            elif step_info.state == TangoStepState.INCOMPLETE:
                incomplete += 1

        step_status: list[str] = []
        if running > 0:
            step_status.append(f"{running} running")
        if failed > 0:
            step_status.append(f"{failed} failed")
        if completed > 0:
            step_status.append(f"{completed} completed")
        if incomplete > 0:
            step_status.append(f"{incomplete} incomplete")

        return cls(
            name=run.name,
            status=status,
            stepStatus=", ".join(step_status),
            started=run.start_date.astimezone(local_timezone()),
        )


class StepStatus(StrEnum):
    incomplete = "incomplete"
    """The step has not run yet."""

    running = "running"
    """The step is running right now."""

    completed = "completed"
    """The step finished running successfully."""

    failed = "failed"
    """The step ran, but failed."""

    uncacheable = "uncacheable"
    """The step is uncacheable, so there is no state."""


class StepInfo(BaseModel):
    id: str
    status: StepStatus
    started: Optional[datetime] = None
    ended: Optional[datetime] = None
    # TODO: replace with result location?
    executionURL: Optional[str] = None
    dependencies: list[str] = Field(default_factory=list)

    @classmethod
    def from_tango_step_info(cls, step_info: TangoStepInfo) -> StepInfo:
        return cls(
            id=step_info.unique_id,
            status=step_info.state.value.lower(),
            started=step_info.start_time_local,
            ended=step_info.end_time_local,
            executionURL=step_info.result_location,
            dependencies=list(step_info.dependencies),
        )


class GetWorkspaceOutput(BaseModel):
    url: str
    runs: list[RunInfo]
    allStepInfos: list[StepInfo]


class RunStepInfo(StepInfo):
    name: str
    order: int


class GetRunOutput(RunInfo):
    name: str
    status: RunStatus
    stepStatus: str
    runStepInfos: list[RunStepInfo]
    started: datetime
    ended: Optional[datetime] = None

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
    runs: list[RunInfo]
    # TODO: get rid of this?
    artifacts: dict[str, int] = Field(default_factory=dict)
    # TODO: get rid of this? We'll just have result location
    logURL: Optional[str] = None
