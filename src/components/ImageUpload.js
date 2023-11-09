import React, { useState, useEffect } from 'react';

function ImageUpload() {
  const [images, setImages] = useState([]); // Store an array of selected images
  const [recognitionResults, setRecognitionResults] = useState([]);

  const handleImageUpload = async () => {
    if (images.length === 0) {
      console.error('No images selected');
      return;
    }

    try {
      // Create an array of Promises to send each image separately
      const recognitionPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
          const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            return result.message;
          } else {
            console.error('Error uploading image:', response.statusText);
            return 'Error: ' + response.statusText;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          return 'Error: ' + error.message;
        }
      });

      // Wait for all recognition requests to complete
      const results = await Promise.all(recognitionPromises);

      setRecognitionResults(results);
    } catch (error) {
      console.error('Error handling images:', error);
    }
  };

  // Clear the recognition results when new images are selected
  useEffect(() => {
    setRecognitionResults([]);
  }, [images]);

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))} />
      <button onClick={handleImageUpload}>Upload and Recognize</button>
      {recognitionResults.length > 0 && (
        <div>
          <h2>Recognition Results:</h2>
          <ul>
            {recognitionResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
