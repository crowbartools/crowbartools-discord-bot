import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import {
    IGetCommitsRequest,
    ICreateIssueRequest,
    IIssue,
    ICommitData,
    ISearchResult,
    IRelease,
} from '../types/github';
import { config } from '../config';
import { APIEmbedField } from 'discord.js';

function getDefaultAxiosConfig(): AxiosRequestConfig {
    return {
        auth: {
            username: config.github.user,
            password: config.github.token,
        },
        headers: {
            'User-Agent': 'crowbartools/crowbartools-discord-bot',
        },
    };
}

export async function createIssue(
    createIssueRequest: ICreateIssueRequest
): Promise<IIssue> {
    const createUrl = `https://api.github.com/repos/${createIssueRequest.repo}/issues`;
    const body = {
        title: createIssueRequest.title,
        body: createIssueRequest.body,
        labels: createIssueRequest.labels,
        type: createIssueRequest.type,
    };

    let response: AxiosResponse<IIssue>;
    try {
        response = await axios.post(createUrl, body, getDefaultAxiosConfig());
    } catch (error) {
        console.log(error);
    }

    if (response && response.status === 201) {
        return response.data;
    }

    return null;
}

export async function searchIssues(
    repo: string,
    search: string
): Promise<IIssue[]> {
    if (repo == null) {
        return null;
    }

    let query = `repo:${repo} is:open ${search}`;

    // github doesnt support queries longer than 256
    if (query.length > 256) {
        query = query.substring(0, 255);
    }

    const searchUrl = `https://api.github.com/search/issues?per_page=10&q=${encodeURIComponent(
        query
    )}`;

    let response: AxiosResponse<ISearchResult>;
    try {
        response = await axios.get<ISearchResult>(
            searchUrl,
            getDefaultAxiosConfig()
        );
    } catch (error) {
        console.log('Error searching github issues', error);
    }

    if (response && response.status === 200) {
        return response.data.items;
    }

    return null;
}

export async function getIssue(
    repo: string,
    issueNumber: number
): Promise<IIssue> {
    if (repo == null || issueNumber == null) {
        return null;
    }

    const getIssueUrl = `https://api.github.com/repos/${repo}/issues/${issueNumber}`;

    let response: AxiosResponse<IIssue>;
    try {
        response = await axios.get<IIssue>(
            getIssueUrl,
            getDefaultAxiosConfig()
        );
    } catch (error) {
        console.log('Error getting github issue', error);
    }

    if (response && response.status === 200) {
        return response.data;
    }

    return null;
}

export async function getRecentCommits(
    getCommitsRequest: IGetCommitsRequest
): Promise<ICommitData[]> {
    let commitsUrl = `https://api.github.com/repos/${getCommitsRequest.branch}/commits`;
    commitsUrl += `?sha=${getCommitsRequest.branch}`;
    commitsUrl += `&since=${getCommitsRequest.sinceDateString}`;

    let response: AxiosResponse<ICommitData[]>;
    try {
        response = await axios.get<ICommitData[]>(
            commitsUrl,
            getDefaultAxiosConfig()
        );
    } catch (error) {
        console.log('Error getting recent commit messages', error);
    }

    if (response && response.status == 200) {
        return response.data;
    }

    return null;
}

export async function getLatestFirebotReleaseVersion(): Promise<string | null> {
    const getLatestReleaseUrl =
        'https://api.github.com/repos/crowbartools/firebot/releases/latest';

    let response: AxiosResponse<IRelease>;
    try {
        response = await axios.get<IRelease>(
            getLatestReleaseUrl,
            getDefaultAxiosConfig()
        );
    } catch (error) {
        console.log('Error getting latest firebot release', error);
    }

    if (response && response.status == 200) {
        return response.data?.tag_name;
    }

    return null;
}

export async function getRecentFirebotReleases(): Promise<IRelease[] | null> {
    const getReleasesUrl =
        'https://api.github.com/repos/crowbartools/firebot/releases?per_page=50';

    let response: AxiosResponse<IRelease[]>;
    try {
        response = await axios.get<IRelease[]>(
            getReleasesUrl,
            getDefaultAxiosConfig()
        );
    } catch (error) {
        console.log('Error getting firebot releases', error);
    }

    if (response && response.status == 200) {
        return response.data;
    }

    return null;
}

export interface SupportedVersions {
    currentStable: string | null;
    previousStables: Array<{
        version: string;
        expiresAt: number;
    }>;
    prerelease: string | null;
}

export async function getSupportedFirebotVersions(): Promise<SupportedVersions> {
    const releases = await getRecentFirebotReleases();

    const result: SupportedVersions = {
        currentStable: null,
        previousStables: [],
        prerelease: null,
    };

    if (!releases || releases.length === 0) {
        return result;
    }

    // Find stable releases
    const stableReleases = releases.filter((r) => !r.prerelease);

    // Find prerelease versions (betas, etc)
    const prereleases = releases.filter((r) => r.prerelease);

    // Current stable is the most recent stable release
    if (stableReleases.length > 0) {
        result.currentStable = stableReleases[0].tag_name;

        // Check if previous stable(s) should still be supported (within 30 days of current stable release)
        if (stableReleases.length > 1) {
            const currentStableDate = new Date(stableReleases[0].published_at);
            const now = new Date();
            const daysSinceCurrentStable = Math.floor(
                (now.getTime() - currentStableDate.getTime()) /
                    (1000 * 60 * 60 * 24)
            );

            if (daysSinceCurrentStable <= 30) {
                let supersedingReleaseDate = currentStableDate;
                let daysSinceSupersedingUpdate: number;

                for (const previousStable of stableReleases.slice(1)) {
                    // Calculate how long since release has been superseded
                    daysSinceSupersedingUpdate = (now.getTime() - supersedingReleaseDate.getTime()) / (1000 * 60 * 60 * 24);

                    // If it's been more than 30 days since this release was superseded, we're done. Everything remaining is older.
                    if (daysSinceSupersedingUpdate > 30) {
                        break;
                    }

                    // Calculate expiration date (30 days from superseding stable release)
                    const expirationDate = new Date(supersedingReleaseDate.getTime() + (30 * 24 * 60 * 60 * 1000));

                    result.previousStables.push({
                        version: previousStable.tag_name,
                        expiresAt: Math.floor(expirationDate.getTime() / 1000)
                    });

                    supersedingReleaseDate = new Date(previousStable.published_at);
                }
            }
        }
    }

    // Check if there's a prerelease that hasn't been superseded by a stable
    // A prerelease is still supported if it's newer than the current stable
    if (prereleases.length > 0 && stableReleases.length > 0) {
        const latestPrerelease = prereleases[0];
        const latestPrereleaseDate = new Date(latestPrerelease.published_at);
        const currentStableDate = new Date(stableReleases[0].published_at);

        // Prerelease is supported if it was released after the current stable
        if (latestPrereleaseDate > currentStableDate) {
            result.prerelease = latestPrerelease.tag_name;
        }
    } else if (prereleases.length > 0 && stableReleases.length === 0) {
        // No stable releases, so the prerelease is supported
        result.prerelease = prereleases[0].tag_name;
    }

    return result;
}

export async function getSupportedFirebotVersionField(): Promise<APIEmbedField | null> {
    const supportedVersions = await getSupportedFirebotVersions();

    // Build the list of currently supported versions
    const versionLines: string[] = [];
    if (supportedVersions.currentStable) {
        versionLines.push(`- **${supportedVersions.currentStable}** (Latest)`);
    }
    if (supportedVersions.previousStables.length) {
        for (const previousStable of supportedVersions.previousStables) {
            versionLines.push(
                `- **${previousStable.version}** (Previous - support expires <t:${previousStable.expiresAt}:R>)`
            );
        }
    }
    if (supportedVersions.prerelease) {
        versionLines.push(
            `- **${supportedVersions.prerelease}** (Pre-release)`
        );
    }

    if (versionLines.length > 0) {
        return {
            name: 'Currently Supported Versions',
            value: versionLines.join('\n'),
            inline: false,
        };
    }

    return null;
}
