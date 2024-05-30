import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface IParams {
  username: string;
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

    console.log(`Found ${res.data.length} repos for ${username}`);

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Error fetching issues:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
