import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPost from "../components/UserPost";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import GoToTop from "../utils/goToTop";
//React Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
//=================================================

function CommentPage() {
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  const { id } = useParams();

  const getUserData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");
  };

  const fetchPostData = async () => {
    try {
      const docRef = doc(db, "posts", id);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        const userPost = docSnap.data();
        setPost(userPost);
      });
      return unsubscribe;
    } catch (error) {
      console.log("Error fetching document:", error);
    }
  };

  //-------------------------------------------------

  const getComments = async () => {
    const docRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.data()) {
        setAllComments(snapshot.data().comments);
      } else {
        setAllComments([]);
      }
    });
    return unsubscribe;
  };

  //---------------------------------------

  const submitComment = async () => {
    if (!auth.currentUser) {
      navigate("/login");
    }
    if (!comment) {
      toast.error("Cant submit an empty comment 🤬", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      return;
    }
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, {
      // arrayUnion is the way to add a new array into firestore DB
      comments: arrayUnion({
        comment,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
        user: auth.currentUser.uid
      }),
    });
    setComment("");
  };

  //----------------------------------------

  useEffect(() => {
    fetchPostData();
    getUserData();
    getComments();
  }, [id, user]);
  

  return (
    <motion.main initial={{ opacity: 0}} animate={{ opacity:1 }} exit={{ opacity: 0 }} className="my-4 pt-4 text-zinc-600 text-mono pb-8 min-h-screen">
      <UserPost post={post} />

      {user ? (
        <div>
          <div className="block md:flex md:gap-4">
            <input
              type="text"
              value={comment}
              placeholder="leave a comment"
              className="bg-white px-4 p-2 rounded-lg focus:outline-none w-full text-center md:text-left"
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={submitComment}
              type="submit"
              className="font-bold mt-4 lg:mt-0 py-3 text-gray-100 shadow-md bg-zinc-600 px-6 rounded-xl text-sm md:text-md flex items-center justify-center gap-2
              transition transform hover:scale-105 w-full lg:w-40"
            >
              submit
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center md:text-lg pt-4">
          <Link className='font-extrabold underline transition transform hover:scale-105 text-blue-600' to={'/auth/login'}>Login</Link>&nbsp;
          <h2>to leave comments</h2>
        </div>
        
      )}
      
      <div className="p-8 mb-4">
        <div className="border-b-2">
          <h2 className="font-bold text-xl mb-6 pt-4 text-center md:text-left">
            Comments
          </h2>
        </div>

        {allComments?.map((comment, i) => (
          <div className="my-4 border-b-2" key={i}>
            <div className="flex items-center gap-2">
              <Link to={`/${comment.username}/${comment.user}`}>
              <img
                src={comment.avatar}
                alt=""
                className="w-12 rounded-full border-2 border-black"
              />
              </Link>


              <h2 className="font-bold">{comment.username}</h2>
            </div>
            <p className="pt-4 pb-4 md:text-lg">{comment.comment}</p>
          </div>
        ))}
      </div>
     
      <GoToTop/>
    </motion.main>
  );
}

export default CommentPage;
