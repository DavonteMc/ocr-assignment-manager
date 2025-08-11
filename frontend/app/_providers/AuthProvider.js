"use client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function UserSynchronizer() {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading || !isAuthenticated || !user) return;

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        });

        // The 'user' object from useAuth0() contains the profile information
        // We can pass this directly instead of fetching idToken claims again
        await fetch("/api/users/ensure", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, name: user.name, auth0Id: user.sub }),
        });
        console.log("User synced successfully");
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  return null;
}

export default function AuthProvider({ children }) {
  const redirectUri = typeof window !== "undefined" ? window.location.origin : undefined;

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
    >
      <UserSynchronizer />
      {children}
    </Auth0Provider>
  );
}