"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logoutAction } from "@/actions/logout";
const SettingsPage = () => {
  const user = useCurrentUser();
  return (
    <div className="bg-white p-10 rounded-xl">
      {JSON.stringify(user)}
      <form>
        <button onClick={logoutAction} type="submit">
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;

// This page is part of the protected area of the application.
// It should be accessible only to authenticated users.
// Ensure that you have proper authentication checks in place before rendering this page.
