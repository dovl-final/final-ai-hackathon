import { redirect } from "next/navigation";

// Redirect from old /visualization route to the new /admin/visualization route
export default function VisualizationRedirect() {
  redirect("/admin/visualization");
}