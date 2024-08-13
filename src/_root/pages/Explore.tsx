import { Models } from "appwrite";
import { Loader, PostCard } from "@/components/shared";
import GeminiChat from "@/components/shared/GeminiChat";
import { useGetRecentPosts } from "@/lib/react-query/queries_old";
import { Listing } from '@/types'; // Import the Listing type

const Explore = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const handleGeminiChatResults = (results: Listing[]) => {
    console.log("Gemini Chat Results in Explore:", results);
    // Handle the results
  };

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 ">
      <div className="home-container ">
        <div className="home-posts ">
          <h2 className="h3-bold md:h2-bold text-left w-full">Find your Home</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Nest Chats</h3>
        <GeminiChat onResults={handleGeminiChatResults} />
      </div>
    </div>
  );
};

export default Explore;
