# models.py
# ---------------------------------------
# Defines the Cat model for the database
# Includes SQLAlchemy setup and serialization logic
# ---------------------------------------

from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime

db = SQLAlchemy()

class Cat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False) 
    bodega_name = db.Column(db.String(200), nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self): 
        return { 
            'id': self.id, 
            'name': self.name, 
            'description': self.description, 
            'latitude': self.latitude, 
            'longitude': self.longitude, 
            'image_url': self.image_url, 
            'bodega_name': self.bodega_name, 
            'created_at': self.created_at.isoformat() 
        }