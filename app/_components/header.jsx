"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 border-b shadow-sm border-gray-300">
      <div className="flex justify-between items-center">
        <img src="/logo.svg" alt="Logo" />
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <UserButton />
          </div>
        ) : (
          <SignInButton redirectUrl="/dashboard">
            <Button className="p-5">Get Started</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Header;
