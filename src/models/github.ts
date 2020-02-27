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
