#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask
from flask import request, redirect, url_for
from flask import jsonify

# --------------------------------------------------------------------------
# CONFIGURATION
# --------------------------------------------------------------------------

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_folder='shinchanjs')


class RestError(Exception):

    def __init__(self, message, status_code=None, payload=None):
        super().__init__(self)
        self.message = message
        self.status_code = status_code if status_code else 400
        self.payload = payload

    def to_json(self):
        err = dict(self.payload or ())
        err['message'] = self.message


@app.errorhandler(RestError)
def handle_rest_error(error):
    response = jsonify(error.to_json())
    response.status_code = error.status_code
    return response


# --------------------------------------------------------------------------
# ACCESS POINTS
# --------------------------------------------------------------------------

@app.route('/post/', methods=['POST'])
def post():
    name = request.form['name']
    value = request.form['value']
    id = request.form['pk']
    print("I received [{id}] {n}={v}".format(n=name, v=value, id=id))
    if value:
        return ''
    else:
        raise RestError("Value cannot be empty", status_code=406)


@app.route('/')
def index():
    return redirect(url_for('static', filename='index.html'))


# --------------------------------------------------------------------------
# MAIN
# --------------------------------------------------------------------------

if __name__ == "__main__":
    app.run()
