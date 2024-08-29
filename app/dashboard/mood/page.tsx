"use client";
import React from "react";
import MoodForm from "../../components/moodform/page";
import { SignOutButton } from "@clerk/nextjs";
import { Link } from "lucide-react";

const MoodPage: React.FC = () => {
  return (
    <>
      <div className="p-8">
        <button className="bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          <SignOutButton />
        </button>

        {""}

        <h1 className="text-2xl font-bold mb-6 bg-center content-center flex items-center justify-center">
          Create Playlist by Mood
        </h1>
        <MoodForm />
      </div>
    </>
  );
};

export default MoodPage;
