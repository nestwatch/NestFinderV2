import vision, { protos } from '@google-cloud/vision';
import { NextApiRequest, NextApiResponse } from 'next';
import { Listing } from '@/types';

const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/shijinjayaprakash/Desktop/Nestwatch_v1/config/eternal-tempest-394618-73eb978c9a33.json',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { listings, query } = req.body;

  if (!listings || !query) {
    return res.status(400).json({ error: 'Missing listings or query in the request body' });
  }

  const filteredListings: Listing[] = [];
  const queryKeywords = query.toLowerCase().split(' ');

  for (const listing of listings) {
    for (const imageUrl of listing.imageUrls) {
      try {
        const request: protos.google.cloud.vision.v1.IAnnotateImageRequest = {
          image: { source: { imageUri: imageUrl } },
          features: [{ type: protos.google.cloud.vision.v1.Feature.Type.LABEL_DETECTION, maxResults: 10 }],
        };

        const [result] = await client.batchAnnotateImages({ requests: [request] });

        if (result.responses && result.responses[0]?.labelAnnotations) {
          const labels = result.responses[0].labelAnnotations.map(label => label.description?.toLowerCase() || '');

          const match = queryKeywords.some((keyword: string) => labels.includes(keyword));

          if (match) {
            filteredListings.push(listing);
            break; // No need to check other images in this listing
          }
        } else {
          console.error('No label annotations found for image:', imageUrl);
        }
      } catch (error) {
        console.error('Error analyzing image with Vision API:', error);
        return res.status(500).json({ error: 'Failed to analyze image' });
      }
    }
  }

  res.status(200).json(filteredListings);
}