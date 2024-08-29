import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { LocateIcon, SmilePlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <>
      <SignedIn>
        <div className="flex space-x-4">
          <button className="bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            <SignOutButton />
          </button>
          <button className="bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            <Link href="/dashboard/Profile">Profile</Link>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen p-8 background-image">
          <h1 className="text-4xl font-bold mb-8 align-text-top">
            Welcome to Emosync
          </h1>
          <div className="w-full max-w-md bg-lime-200 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 justify-center align-item text-center">
              Create a Spotify playlist!
            </h2>
            <p className="mb-6 justify-center align-item text-center">
              Click the button below to create your own customised mood based
              playlist:
            </p>
            <div className="flex flex-row justify-evenly space-x-8">
              <Link
                href="/dashboard/mood"
                className="flex items-center p-4 border rounded-lg shadow-lg bg-white hover:bg-gray-100 transition"
              >
                <SmilePlusIcon className="mr-2" size={20} />
                By mood
              </Link>
              {/* <Link
                href="/dashboard/location"
                className="flex items-center p-4 border rounded-lg shadow-lg bg-white hover:bg-gray-100 transition"
              >
                <LocateIcon className="mr-2" size={20} />
                By location
              </Link> */}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
          <p className="text-lg font-medium">
            Sign in to access your dashboard
          </p>
        </div>
      </SignedOut>
    </>
  );
};

export default Dashboard;
