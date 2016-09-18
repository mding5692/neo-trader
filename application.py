import quandl
from flask import Flask



app = Flask(__name__)

@app.route("/index")
def root():
	return app.send_static_file('index.html')

