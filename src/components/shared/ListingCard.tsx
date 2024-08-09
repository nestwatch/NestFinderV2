import { Models } from "appwrite";
import { Link } from "react-router-dom";
import ReactImageGallery from 'react-image-gallery';
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import ListingStats from "./ListingStats";

type ListingCardProps = {
  Listing: Models.Document & {
    Address: string;
    City: string;
    Province: string;
    Bedroom: string;
    Bathroom: number;
    Parking: number;
    Sqft: string;
    imageUrls?: string[];
  };
};

const ListingCard = ({ Listing }: ListingCardProps) => {
  const { user } = useUserContext();

  if (!Listing || !Listing.Address) return null;

  const images = Listing.imageUrls?.map((url) => ({
    original: url,
    thumbnail: url,
  })) || [{
    original: "/assets/icons/profile-placeholder.svg",
    thumbnail: "/assets/icons/profile-placeholder.svg"
  }];

  return (
    <div className="Listing-card bg-dark-blue rounded-lg border border-dark-4 p-5 lg:p-7">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${Listing.creator?.$id}`}>
            <img
              src={
                Listing.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {Listing.creator?.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(Listing.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {Listing.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-Listing/${Listing.$id}`}
          className={`${user.id !== Listing.creator?.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/Listings/${Listing.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="text-light-2">{Listing.Address}, {Listing.City}, {Listing.Province}</p>
          <ul className="flex gap-1 mt-2">
            {Listing.tags?.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      {/* Display the image gallery */}
      <div className="image-gallery-container">
        <ReactImageGallery
          items={images}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showBullets={true}
        />
      </div>

      <div className="Listing-card-details mt-2">
        <p className="mt-2">
          {`CAD ${new Intl.NumberFormat('en-CA', { 
            style: 'decimal', 
            maximumFractionDigits: 0 
          }).format(Listing.Price)}`}
        </p>
        <p className="mt-2">
          {Listing.Bedroom} Bedroom | {Listing.Bathroom} Bathroom | {Listing.Parking} Parking | {Listing.Sqft} sqft
        </p>
      </div>

      <ListingStats Listing={Listing} userId={user.id} />
    </div>
  );
};

export default ListingCard;