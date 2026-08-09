import { logout } from "@/actions/auth/logout";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit">
        Logout
      </button>
    </form>
  );
}