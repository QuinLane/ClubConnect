import { Link } from "react-router-dom";
import React, { useState } from "react";
// import Image from "next/image";

//import { signOut } from "firebase/auth/cordova";


const Navbar = () => {
  const [show, SetShow] = useState(false);

  const handleToggleMenu = () => {
    SetShow(!show);
  };

  const handleLogout = async () => {
    // // Remove user data from session storage
    // sessionStorage.removeItem('user');
    // sessionStorage.removeItem('uid');
    // await signOut(projectAuth)
    // // Redirect user to the login page or any other desired location
    // window.location.href = '/';

  };

  return (
    <nav className="flex items-center justify-between  flex-wrap bg-uni-ty_orange p-2">
      <div className="flex items-center   flex-shrink-0 text-white mr-6">
        <Link href="/admin">
          {/* <Image
            src={"/uni-ty_logo.png"}
            width={70}
            height={100}
            alt="Uni-ty logo"
            className="w-250px h-205px md:w-350px md:h-350px"></Image> */}
        </Link>
      </div>

      <div className="block lg:hidden">
        <button
          onClick={handleToggleMenu}
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div
        className={`w-full ${
          show ? "block" : "hidden"
        } flex-grow  lg:flex lg:items-center lg:w-auto flex-grow-0`}>
        <div className="text-sm lg:flex-grow-0 mr-auto mr-12">
          <Link
            href="/buyer"
            className="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-12">
            Shop
          </Link>
          <Link
            href="/profile"
            className="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-12">
            Who is Unity?
          </Link>
          <Link
            href="/groups"
            className="block mt-4 lg:inline-block lg:mt-0  hover:text-white mr-12">
            Contact
          </Link>
          <Link
            href="/profile"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-12">
            My Profile
          </Link>
        </div>
        <div>
          <Link
            href="/explore"
            className="inline-block text-sm px-4 py-2 leading-none bg-uni-ty_red border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
            Favourites
          </Link>
        </div>
        <div>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="inline-block text-sm ml-1 px-4 py-2 leading-none bg-red-500 border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;