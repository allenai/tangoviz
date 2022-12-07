import logging

from fastapi import FastAPI

from .utils import setup_logging

setup_logging()
logger = logging.getLogger("uvicorn")

app = FastAPI()

# This route simply tells anything that depends on the API that it's
# working. If you'd like to redefine this behavior that's ok, just
# make sure a 200 is returned.
@app.get("/")
def index() -> str:
    return "All good :)"


@app.get("/api/workspace/{wsid}")
def get_workspace(wsid: str):
    # todo: fill in moc with real data
    moc_answer = {
        "url": wsid,
        "runs": [
            {
                "name": "name 1",
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 21:45",
                "stepStatus": "25 completed",
            },
            {
                "name": "name 2",
                "status": "failed",
                "started": "2022-10-19 18:42",
                "ended": "2022-10-19 19:18",
                "stepStatus": "20 completed, 5 failed",
            },
            {
                "name": "name 3",
                "status": "running",
                "started": "2022-10-21 17:45",
                "stepStatus": "100 running, 43 completed, 5 failed, 35 not started",
            },
        ],
        "allStepInfos": [
            {
                "id": "id 1",
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-21 19:45",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": [],
            },
            {
                "id": "id 2",
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-21 19:45",
                "executionURL": "beaker://ai2/task-complexity/ex2",
                "dependencies": ["id 1"],
            },
            {
                "id": "id 3",
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 21:45",
                "executionURL": "beaker://ai2/task-complexity/ex3",
                "dependencies": ["id 1", "id 2"],
            },
        ],
    }
    return moc_answer


@app.get("/api/workspace/{wsid}/run/{rid}")
def get_run(wsid: str, rid: str):
    # todo: fill in moc with real data
    moc_answer = {
        "name": "name " + rid,
        "status": "completed",
        "started": "2022-10-20 19:45",
        "ended": "2022-10-20 19:45",
        "stepStatus": "3 completed",
        "runStepInfos": [
            {
                "id": "Preparing-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                "name": "prepare",
                "order": 1,
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 19:59",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": [],
            },
            {
                "id": "Pretraining-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                "name": "pretrain",
                "order": 2,
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 19:59",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": ["Preparing-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83"],
            },
            {
                "id": "Intermediate_eval-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                "name": "intermediate_eval",
                "order": 2,
                "status": "failed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 19:59",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": [
                    "Preparing-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                    "Pretraining-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                ],
            },
            {
                "id": "Finetune-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                "name": "finetune",
                "order": 3,
                "status": "running",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 19:59",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": [
                    "Preparing-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                    "Pretraining-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                ],
            },
            {
                "id": "Final_eval-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                "name": "final_eval",
                "order": 4,
                "status": "not started",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 19:59",
                "executionURL": "beaker://ai2/task-complexity/ex1",
                "dependencies": [
                    "Intermediate_eval-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                    "Preparing-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                    "Finetune-002rep-45jdfuf75ky836fusdtr75ikd95psi7ri83",
                ],
            },
        ],
    }
    return moc_answer


@app.route("/api/workspace/{wsid}/step/{sid}")
def get_step(wsid: str, sid: str):
    # todo: fill in moc with real data
    moc_answer = {
        "id": sid,
        "status": "completed",
        "started": "2022-10-20 19:45",
        "ended": "2022-10-20 19:45",
        "executionURL": "beaker://ai2/task-complexity/ex1",
        "runs": [
            {
                "name": "name 1",
                "status": "completed",
                "started": "2022-10-20 19:45",
                "ended": "2022-10-20 21:55",
                "stepStatus": "25 completed",
            },
            {
                "name": "name 2",
                "status": "failed",
                "started": "2022-10-19 18:42",
                "ended": "2022-10-19 18:55",
                "stepStatus": "20 completed, 5 failed",
            },
            {
                "name": "name 3",
                "status": "running",
                "started": "2022-10-21 17:45",
                "stepStatus": "100 running, 43 completed, 5 failed, 35 not started",
            },
        ],
        "artifacts": {
            "/sqlite/test.zip": 1650001,
            "/sqlite/train.zip": 16440001,
            "/sqlite/val.zip": 987001,
            "/logs/pass1.txt": 165001,
            "/logs/pass2.txt": 260001,
        },
        "logURL": "beaker://ai2/task-complexity/ggt/log.txt",
    }
    return moc_answer


# todo: this api is expected to return a downloadable file
# where 'aid' is the artifact folder path like '/sqlite/test'
# and wsid is the workspace id
@app.get("/api/workspace/{wsid}/artifact/{aid}")
def get_artifact(wsid: str, aid: str):
    moc_answer = {"jon": "test"}
    return moc_answer
