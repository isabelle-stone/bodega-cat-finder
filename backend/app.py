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
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
    with Image.open(image_path) as img:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(image_path, optimize=True, quality=85)

@app.route('/api/cats', methods=['GET'])
def get_cats():
    """Get all cats w/ optional filtering"""
    cats = Cat.query.all()
    return jsonify([cat.to_dict() for cat in cats])

@app.route('/api/cats', methods=['POST'])
def add_cat():
    """ Create a cat (new cat sighting)"""
    try:
        # file upload handling ... 
        # Check if image file was sent
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']  # Get the uploaded image

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed.'}), 400

        # Generate unique filename
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save and resize image
        file.save(filepath)
        resize_image(filepath)

        # get cat data
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        bodega_name = request.form.get('bodega_name', '').strip()

        try:
            latitude = float(request.form.get('latitude'))
            longitude = float(request.form.get('longitude'))
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid or missing latitude/longitude'}), 400
        
        # create new cat 
        cat = Cat(name=name if name else None, description=description if description else None, latitude=latitude, longitude=longitude, image_url=f'/api/uploads/{filename}', bodega_name=bodega_name if bodega_name else None)

        # add to database
        db.session.add(cat)
        db.session.commit()

        return jsonify(cat.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded images"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5050)