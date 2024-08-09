import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikeListing,
  useSaveListing,
  useDeleteSavedListing,
  useGetCurrentUser,
} from "@/lib/react-query/queries";

type ListingStatsProps = {
  Listing: Models.Document;
  userId: string;
};

const ListingStats = ({ Listing, userId }: ListingStatsProps) => {
  const location = useLocation();

  // Ensure likes is always an array
  const likesList = Array.isArray(Listing.likes) ? Listing.likes.map((user: Models.Document) => user.$id) : [];
  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likeListing } = useLikeListing();
  const { mutate: saveListing } = useSaveListing();
  const { mutate: deleteSaveListing } = useDeleteSavedListing();

  const { data: currentUser } = useGetCurrentUser();

  // Ensure currentUser.save is an array
  const savedListingRecord = currentUser?.save?.find(
    (record: Models.Document) => record.Listing.$id === Listing.$id
  );

  useEffect(() => {
    setIsSaved(!!savedListingRecord);
  }, [currentUser, savedListingRecord, Listing.$id]);

  const handleLikeListing = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likeListing({ listingId: Listing.$id, likesArray });
  };

  const handleSaveListing = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedListingRecord) {
      setIsSaved(false);
      return deleteSaveListing(savedListingRecord.$id);
    }

    saveListing({ userId: userId, listingId: Listing.$id });
    setIsSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikeListing(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSaveListing(e)}
        />
      </div>
    </div>
  );
};

export default ListingStats;