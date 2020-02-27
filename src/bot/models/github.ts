export interface ICreateIssueRequest {
    repo: string;
    title: string;
    body: string;
    labels: string[];
}

export interface IGetCommitsRequest {
    repo: string;
    branch: string;
    sinceDateString: string;
}

export interface IIssue {
    number: number;
    title: string;
    body: string;
    user: {
        login: string;
        avatar_url: string;
    };
    state: string;
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
