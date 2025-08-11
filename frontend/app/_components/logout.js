import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button
      className="w-[12vw] p-1 text-[3vw] md:text-[1.3vw]  text-center font-semibold bg-blue-400 rounded-lg hover:bg-blue-700 hover:text-white hover:scale-105 transition duration-300"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
}
