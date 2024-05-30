import { LanguageCount, Repo, UserRepoStats } from "@/app/types";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface IParams {
  username: string;
}

// Retrieves aggregated repo stats for a given username
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

    const repos: Repo[] = [];
    let page = 1;
    let fetchedRepos: Repo[] = [];

    do {
      const res = await octokit.request(`GET /users/${username}/repos`, {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          accept: "application/vnd.github+json",
        },
        per_page: 100,
        page,
      });

      fetchedRepos = res.data;
      repos.push(...fetchedRepos);
      page++;
    } while (fetchedRepos.length > 0);

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

    const responseData: UserRepoStats = {
      totalCount,
      totalForks,
      languages: sortedLanguagesCount,
    };

    // const response = NextResponse.json(responseData);

    // // Set Cache-Control headers for caching at Vercel's Edge Network
    // response.headers.set(
    //   "Cache-Control",
    //   "public, s-maxage=3600, stale-while-revalidate=59"
    // );
    // response.headers.set("Vercel-CDN-Cache-Control", "max-age=3600");

    // return response;

    return NextResponse.json(responseData);
  } catch (err: any) {
    if (err.status === 404) {
      return new NextResponse("User not found", { status: 404 });
    }
    console.error("Error fetching repos:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
