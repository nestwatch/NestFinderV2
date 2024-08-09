import { Models } from "appwrite";
import { Link } from "react-router-dom";


import { useUserContext } from "@/context/AuthContext";
import ListingStats from "./ListingStats";

type GridListingListProps = {
  Listings: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridListingList = ({
  Listings,
  showUser = true,
  showStats = true,
}: GridListingListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {Listings.map((Listing) => (
        <li key={Listing.$id} className="relative min-w-80 h-80">
          <Link to={`/Listings/${Listing.$id}`} className="grid-Listing_link">
            <img
              src={Listing.imageUrl}
              alt="Listing"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-Listing_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    Listing.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{Listing.creator.name}</p>
              </div>
            )}
            {showStats && <ListingStats Listing={Listing} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridListingList;
