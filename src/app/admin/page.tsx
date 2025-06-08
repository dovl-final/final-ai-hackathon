import { redirect } from "next/navigation";

// Redirect admin dashboard to visualization page
export default function AdminDashboardRedirect() {
  redirect("/admin/visualization");
}