"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  allowedRoles: string[];
};

export const WithRoleProtection = ({ children, allowedRoles }: Props) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    if (!allowedRoles.includes(role as string)) {
      router.push("/unauthorized");
    }
  }, [isLoaded, user, allowedRoles, router]);

  if (!isLoaded) return null;

  return <>{children}</>;
};
