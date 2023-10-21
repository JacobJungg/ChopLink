#Render the build, using flask to server client app
from flask import Flask, redirect, render_template
import firebase_admin
#Import firebase database
from firebase_admin import db
#Used for rendering static pages
import os

#Creates an object for credential certificate
cred_obj = firebase_admin.credentials.Certificate('./ServiceAccountKey.json')

#Link to Firebase database
default_app = firebase_admin.initialize_app(cred_obj,  {
	'databaseURL': 'https://chop-link-default-rtdb.firebaseio.com/'
	})

#Initalize flask application
app = Flask(__name__, static_folder='./build/static', template_folder="./build" )

#Redirect to app (home page)
@app.route("/")
def hello_world():
    return redirect("/app")

#If user goes to /app render template
@app.route("/app")
def homepage():
    return render_template('index.html')

#Redirects to long url (original url)
@app.route('/<path:generatedKey>', methods=['GET'])
#Fetch key from firebase db
def fetch_from_firebase(generatedKey):
    ref = db.reference("/"+ generatedKey)
    data = ref.get()
    #If key can not be found
    if not data:
        return '404 not found'
    #If key is found
    else:
        #Redirect to longurl
        longURL = data['longURL']
        return redirect(longURL)
