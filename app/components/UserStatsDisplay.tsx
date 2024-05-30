import Link from "next/link";
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
    </div>
  );
}
