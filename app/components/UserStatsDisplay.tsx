import { UserStats } from "../types";

interface UserStatsProps {
  userName: string;
  userData: UserStats;
}

export default function UserStatsDisplay({
  userName,
  userData,
}: UserStatsProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">{userName}&apos;s Stats</h2>
      <p>Total Repositories: {userData.totalCount}</p>
      <p>Total Forks: {userData.totalForks}</p>
      <p>Languages:</p>
      <ul>
        {Object.entries(userData.languages).map(([language, count]) => (
          <li key={language}>
            {language}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}
