import { Octokit } from 'octokit';
import { graphql } from '@octokit/graphql';

export default class OctokitRepository {
  protected readonly url: string;
  protected readonly graphqlWithAuth: typeof graphql;
  protected readonly octokit: Octokit;
  constructor(
    readonly ownerName: string,
    readonly repositoryName: string,
    private readonly githubTokenParam: string,
  ) {
    this.url = `https://github.com/${ownerName}/${repositoryName}`;
    const githubToken = githubTokenParam || '';
    if (githubToken === '') throw Error(`no github token`);
    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${githubToken}`,
        accept: 'application/vnd.github.inertia-preview+json',
      },
    });
    this.octokit = new Octokit({ auth: githubToken });
  }
}
