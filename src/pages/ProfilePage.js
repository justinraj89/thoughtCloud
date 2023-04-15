import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import UserPost from "../components/UserPost";
import { Link } from "react-router-dom";
import GoToTop from "../utils/goToTop";
// React Toastify
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
//=================================================

function ProfilePage() {
  const { id } = useParams();
  const { username } = useParams()
  const [user, loading] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState([]);

  // GET USERS POSTS
  const getUserPosts = async () => {
    if (loading) return;
    const collectionRef = collection(db, "posts");
    const filter = query(collectionRef, where("user", "==", id));
    const posts = onSnapshot(filter, (snapshot) => {
      setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return posts;
  };

  useEffect(() => {
    getUserPosts();
  }, [user, loading]);


  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      <div className="flex flex-col md:flex-row my-6 justify-center md:justify-start gap-4 border-b-2">
        <div className="flex flex-col md:flex-row items-center justify-center md:pb-6">
          <img src={userPosts[0]?.avatar} alt="user-img" className="w-28 md:w-32"/>
        </div>
        <div className="text-center lg:text-left text-xl md:text-2xl text-zinc-600 md:pl-4 pb-4">
          <h1 className="font-bold">{username}</h1>
          <h2 className="font-bold md:text-xl"><span>Total Posts:</span> {userPosts.length}</h2>
        </div>
      </div>

      <div className="flex flex-col text-zinc-600">
        {userPosts.map((post) => (
          <UserPost post={post} key={post.id} user={user}>
            <div className="w-fit">
              <Link to={`/post/${post.id}`}>
                <div className="flex mt-6 items-center gap-4 justify-center lg:justify-start w-fit">
                  <button
                    className="font-bold bg-transparent text-zinc-600 shadow-md bg-zinc-100  py-2 px-6 rounded-xl text-sm flex items-center justify-center gap-2
                  transition transform hover:scale-105"
                  >
                    Comment
                  </button>
                  {post.comments?.length === 1 ? (
                    <p className=" text-zinc-500 hover:underline">
                      {post.comments?.length || 0} comment
                    </p>
                  ) : (
                    <p className=" text-zinc-500 hover:underline">
                      {post.comments?.length || 0} comments
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </UserPost>
        ))}
      </div>

      <GoToTop />
    </motion.main>
  );
}

export default ProfilePage;
