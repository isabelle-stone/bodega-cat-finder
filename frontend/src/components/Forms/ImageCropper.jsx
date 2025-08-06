/**
 * ImageCropper.jsx
 * Fixed version with dragging and sizing
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Move } from 'lucide-react';

function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const aspectRatio = 247 / 146;
  const [cropStyle, setCropStyle] = useState({
    left: 50,
    top: 50,
    width: 200,
    height: 200 / aspectRatio
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('ImageCropper received imageSrc:', imageSrc);
  }, [imageSrc]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully!');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e);
    console.error('This might be a HEIC/HEIF file - browsers don\'t support this format');
    setImageError(true);
    setImageLoaded(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleResizeStart = (handle, e) => {
    setIsResizing(true);
    setResizeHandle(handle);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - container.left;
    const mouseY = e.clientY - container.top;

    if (isDragging) {
      const x = mouseX - (cropStyle.width / 2);
      const y = mouseY - (cropStyle.height / 2);

      const maxX = container.width - cropStyle.width;
      const maxY = container.height - cropStyle.height;

      setCropStyle(prev => ({
        ...prev,
        left: Math.max(0, Math.min(x, maxX)),
        top: Math.max(0, Math.min(y, maxY))
      }));
    } else if (isResizing && resizeHandle) {
      const minSize = 50;
      const maxWidth = container.width - cropStyle.left;
      const maxHeight = container.height - cropStyle.top;

      let newWidth = cropStyle.width;
      let newHeight = cropStyle.height;
      let newLeft = cropStyle.left;
      let newTop = cropStyle.top;

      switch (resizeHandle) {
        case 'se': // bottom-right
          newWidth = Math.max(minSize, Math.min(mouseX - cropStyle.left, maxWidth));
          newHeight = newWidth / aspectRatio;
          // Check if height fits
          if (newHeight > container.height - cropStyle.top) {
            newHeight = container.height - cropStyle.top;
            newWidth = newHeight * aspectRatio;
          }
          break;
        case 'sw': // bottom-left
          const potentialWidth = Math.max(minSize, cropStyle.left + cropStyle.width - Math.max(0, mouseX));
          newWidth = potentialWidth;
          newHeight = newWidth / aspectRatio;
          // Check bounds
          if (newHeight > container.height - cropStyle.top) {
            newHeight = container.height - cropStyle.top;
            newWidth = newHeight * aspectRatio;
          }
          newLeft = cropStyle.left + cropStyle.width - newWidth;
          break;
        case 'ne': // top-right
          newWidth = Math.max(minSize, Math.min(mouseX - cropStyle.left, maxWidth));
          newHeight = newWidth / aspectRatio;
          // Check bounds
          if (newHeight > cropStyle.top + cropStyle.height) {
            newHeight = cropStyle.top + cropStyle.height;
            newWidth = newHeight * aspectRatio;
          }
          newTop = cropStyle.top + cropStyle.height - newHeight;
          break;
        case 'nw': // top-left
          const potentialWidthNW = Math.max(minSize, cropStyle.left + cropStyle.width - Math.max(0, mouseX));
          newWidth = potentialWidthNW;
          newHeight = newWidth / aspectRatio;
          // Check bounds
          if (newHeight > cropStyle.top + cropStyle.height) {
            newHeight = cropStyle.top + cropStyle.height;
            newWidth = newHeight * aspectRatio;
          }
          newLeft = cropStyle.left + cropStyle.width - newWidth;
          newTop = cropStyle.top + cropStyle.height - newHeight;
          break;
      }

      setCropStyle({
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleSave = async () => {
    if (!imageLoaded) {
      alert('Image not loaded yet, please wait...');
      return;
    }

    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const container = containerRef.current;
      
      if (!img || !container) {
        throw new Error('Image not loaded');
      }

      const imgRect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      const cropX = cropStyle.left;
      const cropY = cropStyle.top;
      const cropWidth = cropStyle.width;
      const cropHeight = cropStyle.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const sourceX = cropX * scaleX;
      const sourceY = cropY * scaleY;
      const sourceWidth = cropWidth * scaleX;
      const sourceHeight = cropHeight * scaleY;

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, cropWidth, cropHeight
      );

      canvas.toBlob((blob) => {
        onCropComplete(blob);
        setIsProcessing(false);
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Cropping error:', error);
      alert('Error cropping image: ' + error.message);
      setIsProcessing(false);
    }
  };

  // Debug info
  if (!imageSrc) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        ERROR: No image source provided to cropper
        <button onClick={onCancel} style={{ marginLeft: '20px', padding: '10px' }}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Crop Your Cat Photo
        </h2>
        <button 
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Image Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {imageError ? (
          <div style={{
            color: 'white',
            fontSize: '18px',
            textAlign: 'center'
          }}>
            Failed to load image<br/>
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#fbbf24' }}>
              This appears to be a HEIC/HEIF file (iPhone format)<br/>
              Browsers don't support this format natively :( <br/><br/>
              <strong>Solutions:</strong><br/>
              • Convert to JPG/PNG first (https://cloudconvert.com/jpg-converter)<br/>
              • Try a different photo <br/>
              • Text me this might be a bug grrr
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '70vh',
              border: '2px solid #374151',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              display: 'inline-block'
            }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Cat to crop"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '70vh',
                userSelect: 'none',
                objectFit: 'contain'
              }}
              draggable={false}
            />
            
            {imageLoaded && (
              <>
                {/* Crop Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none'
                }} />
                
                {/* Crop Area */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${cropStyle.left}px`,
                    top: `${cropStyle.top}px`,
                    width: `${cropStyle.width}px`,
                    height: `${cropStyle.height}px`,
                    border: '3px solid #f97316',
                    backgroundColor: 'transparent',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <Move size={24} color="#f97316" style={{ opacity: 0.8 }} />
                  
                  {/* Resize handles */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f97316',
                      cursor: 'nw-resize',
                      borderRadius: '2px'
                    }}
                    onMouseDown={(e) => handleResizeStart('nw', e)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f97316',
                      cursor: 'ne-resize',
                      borderRadius: '2px'
                    }}
                    onMouseDown={(e) => handleResizeStart('ne', e)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f97316',
                      cursor: 'sw-resize',
                      borderRadius: '2px'
                    }}
                    onMouseDown={(e) => handleResizeStart('sw', e)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      right: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f97316',
                      cursor: 'se-resize',
                      borderRadius: '2px'
                    }}
                    onMouseDown={(e) => handleResizeStart('se', e)}
                  />
                </div>
              </>
            )}
            
            {!imageLoaded && !imageError && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#6b7280',
                fontSize: '16px'
              }}>
                Loading image...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {imageLoaded ? 'Drag to move • Drag corners to resize' : 'Waiting for image to load...'}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing || !imageLoaded}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: imageLoaded ? '#f97316' : '#9ca3af',
              color: 'white',
              cursor: (isProcessing || !imageLoaded) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} />
            {isProcessing ? 'Processing...' : 'Crop Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;