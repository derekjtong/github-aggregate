"use client";
import Link from "next/link";
import { useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import { UserRepoStats, UserStats } from "../types";
import PieChart from "./PieChart";

interface UserStatsProps {
  userData: UserStats;
  userRepoData: UserRepoStats;
}

export default function UserStatsDisplay({
  userData,
  userRepoData,
}: UserStatsProps) {
  const [showRawData, setShowRawData] = useState(false);

  const toggleRawData = () => {
    setShowRawData(!showRawData);
  };
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">
        <Link
          href={userData.html_url}
          target="_blank"
          className="text-blue-500 hover:underline flex items-center"
        >
          <div className="mr-2">{userData.login}&apos;s Stats</div>
          <LuExternalLink />
        </Link>
      </h2>
      <p>Total Repositories: {userRepoData.totalCount}</p>
      <p>Total Forks: {userRepoData.totalForks}</p>
      <p>Languages:</p>
      {/* <ul>
        {Object.entries(userRepoData.languages).map(([language, count]) => (
          <li key={language}>
            {language}: {count}
          </li>
        ))}
      </ul> */}
      <PieChart userRepoData={userRepoData} />
      <button
        onClick={toggleRawData}
        className="py-2 bg-blue-500 text-white rounded hover:bg-blue-600 top-0 right-0 fixed w-60"
      >
        {showRawData ? "Hide Raw Data" : "Show Raw Data"}
      </button>
      {showRawData && (
        <div className="top-10 bg-gray-100 p-4 rounded fixed right-0">
          <h3 className="text-xl font-semibold">Raw Data:</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Language</th>
                <th className="py-2 px-4 border-b">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userRepoData.languages).map(
                ([language, count]) => (
                  <tr key={language}>
                    <td className="py-2 px-4 border-b">{language}</td>
                    <td className="py-2 px-4 border-b">{count}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
