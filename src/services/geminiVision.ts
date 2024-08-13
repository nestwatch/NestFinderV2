import { Listing } from '@/types'; // Adjust the path according to your project structure
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/shijinjayaprakash/Desktop/Nestwatch_v1/config/eternal-tempest-394618-73eb978c9a33.json', 
});

export const analyzeImagesWithVision = async (listings: Listing[], query: string): Promise<Listing[]> => {
  const filteredListings: Listing[] = [];
  const queryKeywords = query.toLowerCase().split(" ");

  for (const listing of listings) {
    for (const imageUrl of listing.imageUrls) {
      try {
        // Perform label detection on the image
        const [result] = await client.labelDetection(imageUrl);
        const labels = result.labelAnnotations?.map(label => label.description?.toLowerCase() || '');

        if (labels) {
          // Check if any of the labels match keywords in the query
          const match = queryKeywords.some(keyword => labels.includes(keyword));

          if (match) {
            filteredListings.push(listing);
            break; // No need to check other images in this listing
          }
        } else {
          console.error("No label annotations found for image:", imageUrl);
        }
      } catch (error) {
        console.error("Error analyzing image with Vision API:", error);
      }
    }
  }

  return filteredListings;
};