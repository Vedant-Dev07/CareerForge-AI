import "server-only";

// GitHub API client for fetching profile and repository data

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  visibility: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  license: { key: string | null } | null;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubReadme {
  content: string;
  encoding: string;
}

export class GitHubClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CareerForge-AI",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getProfile(): Promise<GitHubProfile> {
    return this.fetch<GitHubProfile>("/user");
  }

  async getRepositories(): Promise<GitHubRepository[]> {
    // Fetch public repositories, sorted by updated
    const repos = await this.fetch<GitHubRepository[]>(
      "/user/repos?sort=updated&per_page=100&type=public"
    );
    return repos;
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguages> {
    try {
      return await this.fetch<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);
    } catch {
      return {};
    }
  }

  async getRepositoryReadme(owner: string, repo: string): Promise<GitHubReadme | null> {
    try {
      return await this.fetch<GitHubReadme>(`/repos/${owner}/${repo}/readme`);
    } catch {
      return null;
    }
  }

  async enrichRepository(repo: GitHubRepository): Promise<GitHubRepository & { languages?: GitHubLanguages; readmeLength?: number }> {
    const [owner, repoName] = repo.full_name.split("/");
    
    const [languages, readme] = await Promise.all([
      this.getRepositoryLanguages(owner, repoName),
      this.getRepositoryReadme(owner, repoName),
    ]);

    const readmeLength = readme 
      ? Buffer.from(readme.content, readme.encoding as BufferEncoding).toString("utf-8").length 
      : 0;

    return {
      ...repo,
      languages,
      readmeLength,
    };
  }
}

// Technology detection from repository languages and names
export const TECHNOLOGY_MAP: Record<string, string[]> = {
  javascript: ["JavaScript", "js", "javascript"],
  typescript: ["TypeScript", "ts", "typescript"],
  python: ["Python", "py", "python"],
  java: ["Java", "java"],
  react: ["React", "react", "reactjs", "react-native"],
  "next.js": ["Next.js", "nextjs", "next"],
  "node.js": ["Node.js", "node", "nodejs", "express"],
  sql: ["SQL", "sql", "postgresql", "mysql", "sqlite"],
  postgresql: ["PostgreSQL", "postgres", "postgresql"],
  mysql: ["MySQL", "mysql"],
  mongodb: ["MongoDB", "mongodb", "mongo"],
  docker: ["Docker", "docker"],
  git: ["Git", "git"],
  "machine learning": ["Machine Learning", "ml", "machine-learning", "tensorflow", "pytorch", "scikit-learn"],
  "data analysis": ["Data Analysis", "pandas", "numpy", "data-analysis"],
  "power bi": ["Power BI", "powerbi", "power-bi"],
  "tableau": ["Tableau", "tableau"],
  aws: ["AWS", "amazon-web-services", "aws"],
  "azure": ["Azure", "microsoft-azure", "azure"],
  "google cloud": ["Google Cloud", "gcp", "google-cloud"],
  kubernetes: ["Kubernetes", "k8s", "kubernetes"],
  fastapi: ["FastAPI", "fastapi"],
  django: ["Django", "django"],
  flask: ["Flask", "flask"],
  spring: ["Spring", "spring-boot", "spring"],
  ".net": [".NET", "dotnet", "csharp"],
  go: ["Go", "golang", "go"],
  rust: ["Rust", "rust"],
  swift: ["Swift", "swift"],
  kotlin: ["Kotlin", "kotlin"],
  android: ["Android", "android"],
  ios: ["iOS", "ios"],
  flutter: ["Flutter", "flutter"],
  vue: ["Vue", "vue", "vuejs"],
  angular: ["Angular", "angular"],
  tailwind: ["Tailwind CSS", "tailwind", "tailwindcss"],
  sass: ["Sass", "sass", "scss"],
  graphql: ["GraphQL", "graphql"],
  redis: ["Redis", "redis"],
  elasticsearch: ["Elasticsearch", "elasticsearch"],
  jenkins: ["Jenkins", "jenkins"],
  "ci/cd": ["CI/CD", "cicd", "continuous-integration"],
  testing: ["Testing", "jest", "mocha", "cypress", "testing"],
  terraform: ["Terraform", "terraform"],
  ansible: ["Ansible", "ansible"],
};

export function detectTechnologies(
  languages: GitHubLanguages,
  repoName: string,
  topics: string[]
): string[] {
  const detected = new Set<string>();

  // Check languages
  for (const [lang, bytes] of Object.entries(languages)) {
    for (const [tech, keywords] of Object.entries(TECHNOLOGY_MAP)) {
      if (keywords.some(k => lang.toLowerCase().includes(k.toLowerCase()))) {
        detected.add(tech);
      }
    }
  }

  // Check repository name
  for (const [tech, keywords] of Object.entries(TECHNOLOGY_MAP)) {
    if (keywords.some(k => repoName.toLowerCase().includes(k.toLowerCase()))) {
      detected.add(tech);
    }
  }

  // Check topics
  for (const topic of topics) {
    for (const [tech, keywords] of Object.entries(TECHNOLOGY_MAP)) {
      if (keywords.some(k => topic.toLowerCase().includes(k.toLowerCase()))) {
        detected.add(tech);
      }
    }
  }

  return Array.from(detected);
}
