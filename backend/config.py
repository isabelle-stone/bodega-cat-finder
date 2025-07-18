import os 
from dotenv import load_dotenv

load_dotenv() 

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production' 
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///bodega_cats.db' 
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    UPLOAD_FOLDER = 'static/uploads' 
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max image size
