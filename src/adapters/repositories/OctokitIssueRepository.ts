import IssueRepository from '../../usecases/repositories/IssueRepository';
import Issue from '../../models/Issue';
import Project from '../../models/Project';
import OctokitRepository from "./OctokitRepository";

export default class OctokitIssueRepository extends OctokitRepository implements IssueRepository {
  bulkUpdateProject = (issues: Issue[], project: Project): Promise<void> => {
    return Promise.resolve(undefined);
  };

  get = (project: Project): Promise<Issue[]> => {
  };
  buildQueryToGetCard = (url:string, projectName:string)=>`
query ($url: URI! = "${url}", $projectName: String = "${projectName}") {
  resource(url: $url) {
    ... on Repository {
      name
      projects(search: $projectName, first: 10, states: [OPEN]) {
        nodes {
          name
          columns(first: 20) {
            nodes {
              url
              databaseId
              name
              cards(first: 100, archivedStates: [NOT_ARCHIVED]) {
                nodes {
                  url
                  databaseId
                  content {
                    ... on Issue {
                      title
                    }
                    ... on PullRequest {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
      owner {
        ... on ProjectOwner {
          projects(search: $projectName, first: 10, states: [OPEN]) {
            nodes {
              name
              columns(first: 20) {
                nodes {
                  databaseId
                  url
                  name
                  cards(first: 100, archivedStates: [NOT_ARCHIVED]) {
                    nodes {
                      url
                      databaseId
                      content {
                        ... on Issue {
                          title
                        }
                        ... on PullRequest {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
  `
}
