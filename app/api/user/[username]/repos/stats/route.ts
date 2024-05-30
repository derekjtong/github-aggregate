import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface IParams {
  username: string;
}

interface Repo {
  forks_count: number;
  language: string | null;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { username } = params;
    const octokit = new Octokit();

    const res = await octokit.request(`GET /users/${username}/repos`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        accept: "application/vnd.github+json",
      },
    });

    const repos: Repo[] = res.data;

    const totalCount = repos.length;
    const totalForks = repos.reduce(
      (count: number, repo: Repo) => count + repo.forks_count,
      0
    );

    const languageCount: { [key: string]: number } = {};
    repos.forEach((repo: Repo) => {
      if (repo.language) {
        if (languageCount[repo.language]) {
          languageCount[repo.language]++;
        } else {
          languageCount[repo.language] = 1;
        }
      }
    });

    // Sort languages by count in descending order and convert back to an object
    // if a1 < b1 then positive; b before a
    // if a1 > b1 then negative; a before b
    // if a1 == b1 then 0; no change
    const sortedLanguagesCount = Object.fromEntries(
      Object.entries(languageCount).sort((a, b) => b[1] - a[1])
    );

    const responseData = {
      totalCount,
      totalForks,
      languages: sortedLanguagesCount,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Error fetching repos:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
