import { Repo } from "@/app/types";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface IParams {
  username: string;
}

// Retrieves all repositories for a given username
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

    return NextResponse.json(repos);
  } catch (err: any) {
    if (err.status === 404) {
      return new NextResponse("User not found", { status: 404 });
    }
    console.error("Error fetching repos:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
