import yfinance as yf
from flask import Flask, render_template
import pandas as p

app = Flask(__name__)

@app.route("/")

# def index():
#     return render_template('web.html')

def home():
    return "Is the test successful?\n"




