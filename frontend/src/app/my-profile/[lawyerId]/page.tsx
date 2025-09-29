import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import SidebarTabs from "./tabs/Tabs";

const LawyerProfilePageForLawyers = async ({ params }: { params: any }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const requestedLawyerId = resolvedParams.lawyerId;
  const loggedInUserId = user.id;

  if (loggedInUserId !== requestedLawyerId) {
    redirect("/unauthorized");
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <SidebarTabs lawyerId={requestedLawyerId} />
    </div>
  );
};

export default LawyerProfilePageForLawyers;
