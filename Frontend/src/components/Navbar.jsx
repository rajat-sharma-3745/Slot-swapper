import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppContext } from "../Context/AppContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const {logout} = useAppContext();
  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-linear-to-r from-indigo-700 to-violet-500 transition-all">
      <Link to={"/"} className="text-white font-semibold">SLOTSWAPPER</Link>

      <ul className="text-white md:flex hidden items-center gap-10">
        <li>
          <Link className="text-center cursor-pointer" to={'/marketplace'}>
            MarketPlace
          </Link>
        </li>
        <li>
          <Link className="text-center cursor-pointer" to={'/requests'}>
            Requests
          </Link>
        </li>
       
       
      </ul>

      <button
      onClick={logout}
        type="button"
        className="bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
      >
       Logout
      </button>

      <button
      onClick={()=>setIsMenuOpen(p=>!p)}
        aria-label="menu-btn"
        type="button"
        className="inline-block cursor-pointer md:hidden active:scale-90 transition"
      >
       <RxHamburgerMenu/>
      </button>

      <div className={`fixed top-[70px] h-[800px] left-0 w-full p-6 bg-linear-to-r from-indigo-700 to-violet-500  text-base flex flex-col md:hidden items-center  gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <ul className="flex flex-col space-y-4 text-white text-lg">
         <li className="text-center">
          <Link  to={'/marketplace'} onClick={()=>setIsMenuOpen(p=>!p)}>
            MarketPlace
          </Link>
        </li>
        <li className="text-center">
          <Link to={'/requests'} onClick={()=>setIsMenuOpen(p=>!p)}>
            Requests
          </Link>
        </li>
        </ul>
        <button
        onClick={logout}
          type="button"
          className="bg-white text-gray-700 mt-6 inline md:hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
        >
         Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
