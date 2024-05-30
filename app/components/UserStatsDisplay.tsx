import { UserRepoStats, UserStats } from "../types";

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
      <h2 className="text-xl font-bold">{userData.login}&apos;s Stats</h2>
      <p>Total Repositories: {userRepoData.totalCount}</p>
      <p>Total Forks: {userRepoData.totalForks}</p>
      <p>Languages:</p>
      <ul>
        {Object.entries(userRepoData.languages).map(([language, count]) => (
          <li key={language}>
            {language}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}
