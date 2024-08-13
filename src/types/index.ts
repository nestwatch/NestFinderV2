export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export interface INewListing {
    userId: string;  // Correct property name
    address: string;
    title: string;
    description: string;
    price: number;
    Bedroom: string;
    bathrooms: number;
    Sqft: string;
    tags?: string; 
    file: File[];  
  }
  
  export interface IUpdateListing {
    listingId: string;
    imageId?: string; 
    imageUrl?: string;
    title?: string;
    description?: string;
    price?: number;
  }

  export interface Listing {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    title: string;
    address: string;
    city: string;
    province: string;
    price: number;
    Bedroom: string;
    bathrooms: number;
    parking: number;
    postalCode: string;
    Sqft: string;
    forSaleOrRent: string;
    type: string;
    imageUrls: string[];
    description: string;
  }  
  
 
export interface GeminiAIMatch {
  address: string;
  city: string;
  province: string;
  description: string;
  bedrooms: string;  // Use consistent casing
  bathrooms: number;
  parking: number;
  price: number;
  postalCode: string;
  Sqft: string;
  forSaleOrRent: string;
  type: string;
}

