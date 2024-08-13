import vision from '@google-cloud/vision';

const API_KEY = '73eb978c9a339ee94438395aaf91609adabfdbc4';  // Replace with your actual API key

// Initialize the client with the API key
const client = new vision.ImageAnnotatorClient({
  credentials: {
    private_key: API_KEY,
    client_email: 'your-client-email@project-id.iam.gserviceaccount.com', // Optional, required only if using service account
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { imageUrls } = req.body;

  if (!imageUrls || !Array.isArray(imageUrls)) {
    return res.status(400).json({ message: 'Invalid image URLs provided' });
  }

  try {
    const requests = imageUrls.map((imageUrl) => ({
      image: { source: { imageUri: imageUrl } },
      features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
    }));

    const [result] = await client.batchAnnotateImages({ requests });
    const labels = result.responses.map(response => response.labelAnnotations || []);
    res.status(200).json({ labels });
  } catch (error) {
    console.error('Error analyzing images:', error);
    res.status(500).json({ message: 'Failed to analyze images' });
  }
}
