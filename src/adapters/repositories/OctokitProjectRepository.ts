import ProjectRepository from '../../usecases/repositories/ProjectRepository';
import Project from '../../models/Project';
import { Octokit } from 'octokit';
import { graphql, GraphQlQueryResponseData } from '@octokit/graphql';
import OctokitRepository from "./OctokitRepository";

export default class OctokitProjectRepository extends OctokitRepository implements ProjectRepository {
  get = async (name: string): Promise<Project | undefined> => {
    const query = this.buildQueryGetProject(this.url, name, 5);
    const res: GraphQlQueryResponseData = await this.graphqlWithAuth(query);
    const queryForV2 = this.buildQueryGetProjectV2(this.url, name);
    const resV2: GraphQlQueryResponseData = await this.graphqlWithAuth(
      queryForV2,
    );
    const resProject =
      res.resource.projects.nodes[0] ||
      res.resource.owner.projects.nodes[0] ||
      resV2.resource.projectsV2.nodes[0] ||
      resV2.resource.owner.projectsV2.nodes[0] ||
      undefined;
    if (!resProject) return undefined;

    return new Project();
  };
  private buildQueryGetProjectV2 = (url: string, projectName: string) => `
query getColumns($url: URI = "${url}", $projectName: String = "${projectName}") {
  resource(url: $url) {
    ... on Repository {
      name
      projectsV2(query: $projectName, first: 1) {
        nodes {
          title
          fields {
            nodes {
              ... on ProjectV2Field {
                id
                name
              }
              ... on ProjectV2FieldCommon {
                id
                name
              }
              ... on ProjectV2IterationField {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
      owner {
        ... on ProjectV2Owner {
          projectsV2(query: $projectName, first: 1) {
            nodes {
              title
              fields(first: 10) {
                nodes {
                  ... on ProjectV2Field {
                    id
                    name
                  }
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                  ... on ProjectV2IterationField {
                    id
                    name
                  }
                  ... on ProjectV2SingleSelectField {
                    name
                    options {
                      id
                      name
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
`;
  private buildQueryGetProject = (
    url: string,
    projectName: string,
    howManyColumnsToGet: number,
  ): string => `
query getColumns($url: URI = "${url}", $projectName: String = "${projectName}", $howManyColumnsToGet: Int = ${howManyColumnsToGet}) {
  resource(url: $url) {
    ... on Repository {
      name
      projects(search: $projectName, first: 1, states: [OPEN]) {
        nodes {
          name
          columns(first: $howManyColumnsToGet) {
            nodes {
              url
              databaseId
              name
            }
          }
        }
      }
      owner {
        ... on ProjectOwner {
          projects(search: $projectName, first: 1, states: [OPEN]) {
            nodes {
              name
              columns(first: $howManyColumnsToGet) {
                nodes {
                  name
                  databaseId
                }
              }
            }
          }
        }
      }
    }
  }
}
  `;
}
