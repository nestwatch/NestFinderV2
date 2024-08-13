import { useState } from 'react';

const ImageAnalyzer = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[][]>([]);

  const analyzeImages = async () => {
    try {
      const response = await fetch('/api/analyzeImages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrls }),
      });

      const data = await response.json();
      setLabels(data.labels);
    } catch (error) {
      console.error('Error analyzing images:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={imageUrls.join(',')}
        onChange={(e) => setImageUrls(e.target.value.split(','))}
        placeholder="Enter image URLs separated by commas"
      />
      <button onClick={analyzeImages}>Analyze Images</button>
      {labels.length > 0 && (
        <ul>
          {labels.map((labelArray, index) => (
            <li key={index}>{labelArray.join(', ')}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageAnalyzer;
