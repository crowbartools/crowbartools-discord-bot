import axios, { AxiosResponse } from 'axios';
import { ICreateIssueRequest, IIssue } from '../models/github';

export async function createIssue(createIssueRequest: ICreateIssueRequest): Promise<IIssue> {
    let response: AxiosResponse<IIssue>;
    try {
        response = await axios.post(
            `https://api.github.com/repos/${createIssueRequest.repo}/issues`,
            {
                title: createIssueRequest.title,
                body: createIssueRequest.body,
                labels: createIssueRequest.labels,
            },
            {
                auth: {
                    username: process.env.GITHUB_USER,
                    password: process.env.GITHUB_TOKEN,
                },
            }
        );
    } catch (error) {
        console.log(error);
    }

    if (response && response.status === 201) {
        return response.data;
    }

    return null;
}
