"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import InputForm from "./components/InputForm";
import UserStatsDisplay from "./components/UserStatsDisplay";
import { UserStats } from "./types";

export default function Home() {
  const [userData, setUserData] = useState<UserStats | null>();
  const [userName, setUserName] = useState("");
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

      const data: UserStats = response.data;
      setUserData(data);
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
      <div>Home</div>
      <InputForm
        userName={userName}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
        error={error}
      />
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <div>Loading...</div>}
      {userData && <UserStatsDisplay userName={userName} userData={userData} />}
    </div>
  );
}
