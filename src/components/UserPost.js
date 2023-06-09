import moment from "moment";
import { Link } from "react-router-dom";
//=======================================

function UserPost({ children, post }) {
  // Format Date from firebase with moment library
  const datePosted = post.timestamp ? post.timestamp.toDate().toString() : "";
  const formattedDate = moment(datePosted).format("MM/DD/YYYY");
  
  return (
    <main className="bg-white p-8 shadow-md rounded-3xl mb-4">
      <div className="flex border-b-2 my-4 mb-8 gap-4 pb-2 px-2 justify-center md:justify-start">
        <Link to={`/${post.username}/${post.user}`}>
          <img
            src={post.avatar}
            alt={post.username}
            className="w-12 rounded-full border-2 border-black"
          />
        </Link>
        <Link to={`/${post.username}/${post.user}`} className="font-bold flex items-center md:text-xl">
        <h2>
          {post.username}
        </h2>
        </Link>

      </div>
      <div className="px-2">
        <p className="tracking-wide md:text-lg text-center md:text-left">{post.description}</p>
        <p className="text-sm italic pt-6 text-zinc-400 text-center md:text-left">
          Posted: {formattedDate}
        </p>
      </div>
      {children}
    </main>
  );
}

export default UserPost;
