export interface Repo {
  forks_count: number;
  language: string | null;
}

export interface LanguageCount {
  [key: string]: number;
}

export interface UserRepoStats {
  totalCount: number;
  totalForks: number;
  languages: LanguageCount;
}
