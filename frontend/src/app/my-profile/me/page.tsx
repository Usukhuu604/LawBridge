import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RedirectToOwnProfile() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  redirect(`/my-profile/${user.id}`);
}
