import { Link } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"; // anytime you want acess to your user
//==============================

function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [prevScrollPos, setPrevScrollPos] = useState(10);
  const [visible, setVisible] = useState(true);



  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const scrollDelta = currentScrollPos - prevScrollPos;
  
    if (currentScrollPos > 15) {
      if (scrollDelta > 0) {
        // Scrolling down
        setVisible(false);
      } else if (scrollDelta < 0) {
        // Scrolling up
        setVisible(true);
      }
    }
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <nav className={`flex justify-between items-center py-3  sticky bg-gray-100 bg-opacity-95 z-20 rounded-lg mb-4
 ${visible ? 'top-0 transition-transform duration-700 transform translate-y-0' : 'top-0 transition-transform duration-700 transform -translate-y-full'}`}>
      <Link to="/">
        <img
          src={"/moonguy.png"}
          width={100}
          height={100}
          alt="food for thought"
          className="w-20 lg:w-22 opacity-70"
        />
      </Link>

      <ul className="flex items-center gap-10">
        {!user ? (
          <Link
            to="/login"
            className="font-bold text-gray-100 shadow-md bg-zinc-600  py-2 px-6 rounded-xl text-sm flex items-center justify-center gap-2 
            transition transform hover:scale-105"
          >
            login
          </Link>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/post">
              <button
                className="font-bold text-gray-100 shadow-md bg-zinc-600  py-2 px-6 rounded-xl text-sm flex items-center justify-center gap-2
              transition transform hover:scale-105"
              >
                post
              </button>
            </Link>
            <Link to="/dashboard">
              <img
                src={user.photoURL}
                alt=""
                className="w-12 rounded-full cursor-pointer border-2 border-zinc-400"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;


// return (
//   <nav className="flex justify-between items-center py-3 border-b-2 border-zinc-200">
//     <Link to="/">
//       <img
//         src={"/moonguy.png"}
//         width={100}
//         height={100}
//         alt="food for thought"
//         className="w-20 lg:w-22 opacity-70"
//       />
//     </Link>

//     <ul className="flex items-center gap-10">
//       {!user ? (
//         <Link
//           to="/login"
//           className="font-bold text-gray-100 shadow-md bg-zinc-600  py-2 px-6 rounded-xl text-sm flex items-center justify-center gap-2 
//           transition transform hover:scale-105"
//         >
//           login
//         </Link>
//       ) : (
//         <div className="flex items-center gap-6">
//           <Link to="/post">
//             <button
//               className="font-bold text-gray-100 shadow-md bg-zinc-600  py-2 px-6 rounded-xl text-sm flex items-center justify-center gap-2
//             transition transform hover:scale-105"
//             >
//               post
//             </button>
//           </Link>
//           <Link to="/dashboard">
//             <img
//               src={user.photoURL}
//               alt=""
//               className="w-12 rounded-full cursor-pointer border-2 border-zinc-400"
//             />
//           </Link>
//         </div>
//       )}
//     </ul>
//   </nav>
// );
// }