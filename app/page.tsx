"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import InputForm from "./components/InputForm";
import UserStatsDisplay from "./components/UserStatsDisplay";
import { UserRepoStats } from "./types";

export default function Home() {
  const [userData, setUserData] = useState<UserRepoStats | null>();
  const [userName, setUserName] = useState(""); // Username entered by the user, connected to input field
  const [displayUserName, setDisplayUserName] = useState(""); // Username of the user whose data is currently being displayed
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setUserData(null);
    setIsLoading(true);

    if (userName === "") {
      setError("Please enter a user name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/user/${userName}/repos/stats`);

      const data: UserRepoStats = response.data;
      setUserData(data);
      setDisplayUserName(userName);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setError("User not found");
      } else {
        console.error("Error fetching user data:", error);
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl p-5">GitHub User Repo Statistics</h1>
      <InputForm
        userName={userName}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      {userData && (
        <UserStatsDisplay userName={displayUserName} userData={userData} />
      )}
    </div>
  );
}
