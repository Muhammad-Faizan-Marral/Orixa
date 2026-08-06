import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth/logout";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/auth/login");
  }

  return (
    <main>
      <h1>Orixa AI Dashboard</h1>

      <p>
        You are authenticated.
      </p>

      <p>
        User ID: {data.claims.sub}
      </p>

      <form action={logout}>
        <button type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}