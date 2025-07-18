# app.py
# ---------------------------------------
# Main Flask application entry point
# Handles routes for uploading and retrieving cat sightings
# ---------------------------------------
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import uuid
from config import Config
from models import db, Cat


app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename): 
    # ensure file type is compatible
    if '.' not in filename:
        return False  # no extension found
    
    extension = filename.rsplit('.', 1)[1].lower()
    return (extension in ALLOWED_EXT)

def resize_image(image_path, max_size=(800, 600)):
    """Resize image to reduce file size"""

@app.route()