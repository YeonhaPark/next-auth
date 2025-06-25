import { auth, signOut } from "@/auth";
const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session, null, 2)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default SettingsPage;

// This page is part of the protected area of the application.
// It should be accessible only to authenticated users.
// Ensure that you have proper authentication checks in place before rendering this page.
