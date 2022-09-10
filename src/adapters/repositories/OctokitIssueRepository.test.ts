import Issue from '../../models/Issue';
import Project from '../../models/Project';
import OctokitIssueRepository from './OctokitIssueRepository';
import OctokitProjectRepository from './OctokitProjectRepository';

describe('OctokitIssueRepository', () => {
  const projectRepo = new OctokitProjectRepository(
    'HiromiShikata',
    'npm-pkg-move-all-issues-in-projects-to-other-project',
    process.env.GH_TOKEN || '',
  );
  const repo = new OctokitIssueRepository();
  describe('get', () => {
    test.each`
      projectName                               | expectIssueCount
      ${'V2 project on owner for testing'}      | ${1}
      ${'Classic project on owner for testing'} | ${2}
    `(
      `projectName: $projectName, expectIssueCount: $expectIssueCount`,
      async ({ projectName, expectIssueCount }) => {
        const project = await projectRepo.get(projectName);
        if (!project) fail();
        const issues = await repo.get(project);
        expect(issues.length).toEqual(expectIssueCount);
      },
    );
  });
  describe('bulkUpdateProject', () => {
    test.each`
      projectNameFrom                           | projectNameTo                             | expectIssueCountOnNewProject
      ${'V2 project on owner for testing'}      | ${'Classic project on owner for testing'} | ${1}
      ${'Classic project on owner for testing'} | ${'V2 project on owner for testing'}      | ${2}
    `(
      `projectNameFrom: $projectNameFrom, projectNameTo: $projectNameTo, expectIssueCountOnNewProject: $expectIssueCountOnNewProject`,
      async ({
        projectNameFrom,
        projectNameTo,
        expectIssueCountOnNewProject,
      }) => {
        const projectFrom = await projectRepo.get(projectNameFrom);
        if (!projectFrom) fail();
        const projectTo = await projectRepo.get(projectNameTo);
        if (!projectTo) fail();
        const issues = await repo.get(projectFrom);
        await repo.bulkUpdateProject(issues, projectTo);
        const newIssues = await repo.get(projectTo);
        expect(newIssues.length).toEqual(expectIssueCountOnNewProject);
      },
    );
  });
});
