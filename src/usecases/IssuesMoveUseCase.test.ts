import { IssuesMoveUseCase, ProjectNotFoundError } from './IssuesMoveUseCase';
import Project from '../models/Project';
import Issue from '../models/Issue';

describe('IssuesMoveUseCase', () => {
  describe('execute', () => {
    const issueRepository = {
      get: jest.fn(async (project: Project): Promise<Issue[]> => {
        return [];
      }),
      bulkUpdateProject: jest.fn(
        async (issues: Issue[], project: Project): Promise<void> => {},
      ),
    };
    const projectRepository = {
      get: jest.fn(async (name: string): Promise<Project | undefined> => {
        return new Project();
      }),
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('success', async () => {
      const useCase = new IssuesMoveUseCase(projectRepository, issueRepository);
      await useCase.execute('from', 'to');
      expect(issueRepository.get.mock.calls.length).toEqual(1);
      expect(issueRepository.bulkUpdateProject.mock.calls.length).toEqual(1);
      expect(projectRepository.get.mock.calls.length).toEqual(2);
    });
    test('failed with NotFoundError for from', async () => {
      projectRepository.get = jest.fn(async (name: string) =>
        Promise.resolve(undefined),
      );
      const useCase = new IssuesMoveUseCase(projectRepository, issueRepository);

      try {
        await useCase.execute('from', 'to');
        fail();
      } catch (ex) {
        expect(ex).toBeInstanceOf(ProjectNotFoundError);
        expect((ex as Error).message).toEqual('from is not found.');
      }
      expect(issueRepository.get.mock.calls.length).toEqual(0);
      expect(issueRepository.bulkUpdateProject.mock.calls.length).toEqual(0);
      expect(projectRepository.get.mock.calls.length).toEqual(1);
    });

    test('failed with NotFoundError for to', async () => {
      projectRepository.get = jest.fn(async (name: string) =>
        Promise.resolve(name === 'from' ? new Project() : undefined),
      );
      const useCase = new IssuesMoveUseCase(projectRepository, issueRepository);

      try {
        await useCase.execute('from', 'to');
        fail();
      } catch (ex) {
        expect(ex).toBeInstanceOf(ProjectNotFoundError);
        expect((ex as Error).message).toEqual('to is not found.');
      }
      expect(issueRepository.get.mock.calls.length).toEqual(0);
      expect(issueRepository.bulkUpdateProject.mock.calls.length).toEqual(0);
      expect(projectRepository.get.mock.calls.length).toEqual(2);
    });
  });
});
