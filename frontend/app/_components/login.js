import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="w-[25vw] p-2 text-[3.5vw] md:text-[2.5vw] text-center font-semibold bg-blue-400 rounded-lg hover:bg-blue-700 hover:text-white hover:scale-105 transition duration-300" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-[4.5vw] md:text-[3.5vw] font-bold mb-8">Welcome to Student Assignment Manager</h1>
        <LoginButton />
    </div>
  );
}
