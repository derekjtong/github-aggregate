import { LanguageCount, Repo, UserStats } from "@/app/types";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface IParams {
  username: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { username } = params;

    if (
      process.env.GITHUB_TOKEN == "" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.log(
        "No GITHUB_TOKEN env variable set! Limited requests per hour."
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || "",
    });

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

    const languageCount: LanguageCount = {};
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
    const sortedLanguagesCount: LanguageCount = Object.fromEntries(
      Object.entries(languageCount).sort((a, b) => b[1] - a[1])
    );

    const responseData: UserStats = {
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
