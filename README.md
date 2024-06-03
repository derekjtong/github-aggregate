# GitHub User Repo Statistics

This application provides an overview of a GitHub user's repository statistics.

## Technologies Used

* Nextjs
* React
* Axios
* Chart.js
* Tailwind CSS

## Getting Started

1. Clone repository
```bash
git clone https://github.com/derekjtong/github-aggregate
cd github-aggregate
```

3. Install dependencies
```bash
npm i
```
5. Start development server
```bash
npm run dev
```
Optional

* Add your [GitHub fine-grained personal access token](https://github.com/settings/tokens?type=beta) to `.env.local`

## API Endpoints

* `/api/user/[username]/repos/stats`: fetches repository statistics for the given username
* `/api/user/[username]`: fetches user information for the given username
