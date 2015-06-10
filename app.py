#!/usr/bin/env python
#-*- coding: utf-8 -*-

import os
import requests
import json
from flask import Flask, make_response, render_template, request, jsonify
from flask import send_from_directory, session, url_for, redirect
from datetime import datetime, timedelta
from verify_lnkdn import *


app = Flask(__name__)

@app.route('/')
def index():
  return redirect("/home", code=302)

@app.route('/home')
def home():
  return render_template('home.html',
            email=email)

@app.route('/passcode/', methods=['POST'])
def get_passcode():
  # get passcode
  data = request.args.get('data', {})
  email = data.get('email')
  password = data.get('password')
  passcode = None
  if email and password:
    passcode = get_code(email, password)
  return jsonify({'passcode': passcode})

@app.route('/favicon.ico')
def favicon():
  return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico')

@app.route('/clear_sessions')
def clear_sessions():
  session.clear()
  return """
      <p>Session Cleared</p>
      <p><a href="/profiles">Return to Home</a></p>
      """

@app.route('/logout')
def logout():
  session.clear()
  return """
      <p>Logged out</p>
      <p><a href="/profiles">Return to Home</a></p>
      """

@app.route('/shutdown', methods=['POST'])
def shutdown():
  shutdown_server()
  return 'Server shutting down...'

app.secret_key = 'p0^r80j/3yXr~XH H!jm[]]L^x/,?RT'

if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0',port=80)