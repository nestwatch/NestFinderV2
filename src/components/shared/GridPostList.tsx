import { Models } from "appwrite";
import ImageGallery from "react-image-gallery";
import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import "react-image-gallery/styles/css/image-gallery.css"; // Import the gallery styles

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => {
        // Transform image URLs into the format required by ImageGallery
        const images = post.imageUrls?.map((url: string) => ({
          original: url,
          thumbnail: url,
        })) || [];

        return (
          <li key={post.$id} className="relative min-w-80 h-80">
            {images.length > 0 ? (
              <ImageGallery items={images} showThumbnails={false} />
            ) : (
              <img
                src="/assets/icons/image-placeholder.svg"
                alt="post"
                className="h-full w-full object-cover"
              />
            )}

            <div className="grid-post_user">
              {showUser && post.creator && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post.creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                    loading="lazy"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;