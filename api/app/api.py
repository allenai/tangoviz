from flask import Blueprint, jsonify, request, current_app
from random import randint
from time import sleep
from typing import List, Tuple

# Takes a list of strings and filters out any empty strings
def clean_str_list(input: List[str]) -> List[str]:
    # get rid of empty spaces ' ' => ''
    stripped = [s.strip() for s in input]
    # filter out empty elements eg. ''
    return list(filter(None, stripped))

def create_api() -> Blueprint:
    """
    Creates an instance of your API. If you'd like to toggle behavior based on
    command line flags or other inputs, add them as arguments to this function.
    """
    api = Blueprint('api', __name__)

    def error(message: str, status: int = 400) -> Tuple[str, int]:
        return jsonify({ 'error': message}), status

    # This route simply tells anything that depends on the API that it's
    # working. If you'd like to redefine this behavior that's ok, just
    # make sure a 200 is returned.
    @api.route('/')
    def index() -> Tuple[str, int]:
        return '', 204

    @api.route('/api/workspace/<string:wsid>', methods=['GET'])
    def get_workspace(wsid):
        # todo: fill in moc with real data
        moc_answer = {
            'url': wsid,
            'runs': [{
                'name': 'name 1',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-20 21:45',
                'stepStatus': '25 completed',
            },
            {
                'name': 'name 2',
                'status': 'failed',
                'started': '2022-10-19 18:42',
                'ended': '2022-10-19 19:18',
                'stepStatus': '20 completed, 5 failed',
            },
            {
                'name': 'name 3',
                'status': 'running',
                'started': '2022-10-21 17:45',
                'stepStatus': '100 running, 43 completed, 5 failed, 35 not started',
            }],
            'allSteps': [{
                'id': "id 1",
                'atomicStepId': '123',
                'name': 'name 1',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-21 19:45',
                'executionURL': 'http://google.com',
            },
            {
                'id': "id 2",
                'atomicStepId': '345',
                'name': 'name 2',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-21 19:45',
                'executionURL': 'http://google.com',
            },
            {
                'id': "id 3",
                'atomicStepId': '567',
                'name': 'name 3',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-20 21:45',
                'executionURL': 'http://google.com',
            }]
        }
        return jsonify(moc_answer)

    @api.route('/api/workspace/<string:wsid>/run/<string:rid>', methods=['GET'])
    def get_run(wsid, rid):
        # todo: fill in moc with real data
        moc_answer = {
            'name': 'name ' + rid,
            'status': 'completed',
            'started': '2022-10-20 19:45',
            'ended': '2022-10-20 19:45',
            'stepStatus': '3 completed',
            'steps': [{
                'id': "id 1",
                'atomicStepId': '123',
                'name': 'name 1',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-20 19:59',
                'executionURL': 'http://google.com',
            },
            {
                'id': "id 2",
                'atomicStepId': '345',
                'name': 'name 2',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-20 19:55',
                'executionURL': 'http://google.com',
            },
            {
                'id': "id 3",
                'atomicStepId': '567',
                'name': 'name 3',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-21 19:55',
                'executionURL': 'http://google.com',
            }]
        }
        return jsonify(moc_answer)

    @api.route('/api/workspace/<string:wsid>/step/<string:sid>', methods=['GET'])
    def get_step(wsid, sid):
        # todo: fill in moc with real data
        moc_answer = {
            'id': sid,
            'atomicStepId': '123',
            'name': 'name ' + sid,
            'status': 'completed',
            'started': '2022-10-20 19:45',
            'ended': '2022-10-20 19:45',
            'executionURL': 'http://google.com',
            'runs': [{
                'name': 'name 1',
                'status': 'completed',
                'started': '2022-10-20 19:45',
                'ended': '2022-10-20 21:55',
                'stepStatus': '25 completed',
            },
            {
                'name': 'name 2',
                'status': 'failed',
                'started': '2022-10-19 18:42',
                'ended': '2022-10-19 18:55',
                'stepStatus': '20 completed, 5 failed',
            },
            {
                'name': 'name 3',
                'status': 'running',
                'started': '2022-10-21 17:45',
                'stepStatus': '100 running, 43 completed, 5 failed, 35 not started',
            }],
            'artifacts': {
                '/sqlite/test.zip': 1650001,
                '/sqlite/train.zip': 16440001,
                '/sqlite/val.zip': 987001,
                '/logs/pass1.txt': 165001,
                '/logs/pass2.txt': 260001
            },
            'logURL': 'http://google.com'
        }
        return jsonify(moc_answer)

    # todo: this api is expected to return a downloadable file
    # where 'aid' is the artifact forlder path like '/sqlite/test'
    # and wsid is the workspace id
    @api.route('/api/workspace/<string:wsid>/artifact/<string:aid>', methods=['GET'])
    def get_artifact(wsid, aid):
        moc_answer = {
            'jon': 'test'
        }
        return jsonify(moc_answer)

    return api
