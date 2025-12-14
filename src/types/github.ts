export type IssueType = 'Bug' | 'Feature' | 'Task' | 'Support';

export interface ICreateIssueRequest {
    repo: string;
    title: string;
    body: string;
    labels?: string[];
    type: IssueType;
}

export interface IGetCommitsRequest {
    repo: string;
    branch: string;
    sinceDateString: string;
}

interface IIssueLabel {
    name: string;
}

export interface IIssue {
    number: number;
    title: string;
    body: string;
    user: {
        login: string;
        avatar_url: string;
    };
    labels: IIssueLabel[];
    type?: {
        id: number;
        name: IssueType;
        description: string;
        color: string;
    };
    comments: number;
    state: string;
    created_at: string;
    html_url: string;
}

export interface ICommitData {
    commit: {
        message: string;
        committer: {
            date: string;
        };
    };
    author: {
        login: string;
    };
}

export interface ISearchResult {
    total_count: number;
    incomplete_results: boolean;
    items: IIssue[];
}

export interface IRelease {
    tag_name: string;
    published_at: string;
    prerelease: boolean;
}
