import ProjectRepository from "./repositories/ProjectRepository";
import IssueRepository from "./repositories/IssueRepository";

export class IssuesMoveUseCase {
    constructor(
        readonly projectRepository: ProjectRepository,
        readonly issueRepository: IssueRepository,
    ) {
    }

    execute = async (fromName: string, toName: string) => {
        const from = await this.projectRepository.get(fromName)
        const to = await this.projectRepository.get(toName)
        const issues = await this.issueRepository.get(from)
        await this.issueRepository.bulkUpdateProject(issues, to);
    }
}
