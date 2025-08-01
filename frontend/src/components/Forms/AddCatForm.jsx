/**
 * AddCatForm.jsx
 * --------------
 * Form for adding new cats with image cropping
 */

import React, { useState } from 'react';
import { Upload, MapPin, Camera, X } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { catAPI } from '../../services/api';

function AddCatForm({ onCatAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    bodega_name: '',
    description: '',
    latitude: '',
    longitude: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile(file);
      setImagePreview(e.target.result);
      setShowCropper(true);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBlob) => {
    setCroppedImage(croppedBlob);
    setShowCropper(false);
    
    // Create preview URL for cropped image
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setImagePreview(croppedUrl);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCroppedImage(null);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
      },
      (error) => {
        setError('Unable to get your location. Please enter coordinates manually.');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validation
      if (!croppedImage) {
        throw new Error('Please add a photo of the cat');
      }
      if (!formData.latitude || !formData.longitude) {
        throw new Error('Please provide the cat\'s location');
      }

      // Create FormData
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('bodega_name', formData.bodega_name);
      submitData.append('description', formData.description);
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      submitData.append('image', croppedImage, 'cat-photo.jpg');

      // Submit to API
      const result = await catAPI.addCat(submitData);
      
      // Success!
      onCatAdded && onCatAdded(result);
      
      // Reset form
      setFormData({
        name: '',
        bodega_name: '',
        description: '',
        latitude: '',
        longitude: ''
      });
      removeImage();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '20px',
          textAlign: 'center',
          color: '#182540'
        }}>
          Add a Bodega Cat
        </h2>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#182540' }}>
              Cat Photo
            </label>
            
            {!imagePreview ? (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s'
              }}>
                <Camera size={40} style={{ color: '#6b7280', marginBottom: '8px' }} />
                <span style={{ color: '#374151', fontWeight: '500' }}>
                  Click to upload cat photo
                </span>
                <span style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                  You'll be able to crop it after selecting
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div style={{ position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Cat preview"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Cat Name */}
          <div>
            <label style={{ 
                display: 'block', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#182540'
            }}>
              Cat Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Leave blank if name is unknown"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Bodega Name */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#182540'}}>
              Bodega/Store Name
            </label>
            <input
              type="text"
              name="bodega_name"
              value={formData.bodega_name}
              onChange={handleInputChange}
              placeholder=" " // add if needed
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#182540'}}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about this cat!"
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#182540' }}>
              Location 
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
                step="any"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
                step="any"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#374151'
              }}
            >
              <MapPin size={14} />
              Use My Current Location
            </button>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#182540'
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: onCancel ? 1 : 'none',
                width: onCancel ? 'auto' : '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#f97316',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Adding Cat...' : 'Add Cat to Map'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imagePreview && (
        <ImageCropper
          imageSrc={imagePreview}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}

export default AddCatForm;