import { IssuesMoveUseCase } from "./IssuesMoveUseCase";
import IssueRepository from "./repositories/IssueRepository";
import Project from "../models/Project";
import Issue from "../models/Issue";

describe('IssuesMoveUseCase', () => {
    describe('execute', () => {
        test('success', async () => {
            const issueRepository = {
                get: jest.fn(async (project: Project): Promise<Issue[]> => {
                    return []
                }),
                bulkUpdateProject: jest.fn(async (issues: Issue[], project: Project): Promise<void> => {
                }),
            }
            const projectRepository = {

                get: jest.fn(async (name: string): Promise<Project> => {
                    return new Project()
                }),
            }
            const useCase = new IssuesMoveUseCase(projectRepository, issueRepository)
            await useCase.execute('from', 'to')
            expect(issueRepository.get.mock.calls.length).toEqual(1)
            expect(issueRepository.bulkUpdateProject.mock.calls.length).toEqual(1)
            expect(projectRepository.get.mock.calls.length).toEqual(2)

        })

    });

})
