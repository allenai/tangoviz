import logging
from functools import lru_cache

from fastapi import FastAPI, HTTPException
from tango import Workspace

from .types import *
from .util import atob, setup_logging

setup_logging()
logger = logging.getLogger("uvicorn")

app = FastAPI()


@lru_cache(maxsize=8)
def get_cached_workspace(wsid: str) -> Workspace:
    try:
        return Workspace.from_url(atob(wsid))
    except Exception as exc:
        logger.exception(exc)
        raise HTTPException(status_code=500, detail=f"{exc.__class__.__name__}: {str(exc)}")


@app.get("/")
def index() -> str:
    """
    This route simply tells anything that depends on the API that it's working.
    """
    # If you'd like to redefine this behavior that's ok, just make sure a 200 is returned.
    return "All good :)"


@app.get("/api/workspace/{wsid}", response_model=GetWorkspaceOutput)
def get_workspace(wsid: str) -> GetWorkspaceOutput:
    workspace = get_cached_workspace(wsid)
    return GetWorkspaceOutput(
        url=workspace.url,
    )


@app.post("/api/workspace/{wsid}/runs", response_model=GetWorkspaceRunsOutput)
def post_workspace_runs(wsid: str, page: RunPageData):
    workspace = get_cached_workspace(wsid)
    try:
        matching_runs = workspace.search_registered_runs(
            match=page.match,
            sort_by=page.sort_by,
            sort_descending=page.sort_descending,
            start=page.page_size * page.current_page,
            stop=page.page_size * (page.current_page + 1),
        )
    except NotImplementedError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    total_runs = workspace.num_registered_runs(match=page.match)
    return GetWorkspaceRunsOutput(
        data=[PartialRunInfo(name=r.name, started=r.start_date) for r in matching_runs],
        total_items=total_runs,
        **page.dict(),
    )


@app.post("/api/workspace/{wsid}/steps", response_model=GetWorkspaceStepsOutput)
def post_workspace_steps(wsid: str, page: StepPageData):
    workspace = get_cached_workspace(wsid)

    try:
        matching_steps = workspace.search_step_info(
            match=page.match,
            state=page.status,
            sort_by=page.sort_by,
            sort_descending=page.sort_descending,
            start=page.page_size * page.current_page,
            stop=page.page_size * (page.current_page + 1),
        )
    except NotImplementedError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    total_steps = workspace.num_steps(match=page.match, state=page.status)

    return GetWorkspaceStepsOutput(
        data=[StepInfo.from_tango_step_info(step_info) for step_info in matching_steps],
        total_items=total_steps,
        **page.dict(),
    )


@app.get("/api/workspace/{wsid}/run/{rid}", response_model=GetRunOutput)
def get_run(wsid: str, rid: str) -> GetRunOutput:
    workspace = get_cached_workspace(wsid)
    run_name = atob(rid)
    try:
        run = workspace.registered_run(run_name)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Run '{run_name}' not found")
    return GetRunOutput.from_tango_run(run)


@app.get("/api/workspace/{wsid}/step/{sid}", response_model=GetStepOutput)
def get_step(wsid: str, sid: str) -> GetStepOutput:
    workspace = get_cached_workspace(wsid)
    step_id = atob(sid)
    try:
        tango_step_info = workspace.step_info(step_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"No step '{step_id}' found")
    return GetStepOutput(**StepInfo.from_tango_step_info(tango_step_info).dict())
