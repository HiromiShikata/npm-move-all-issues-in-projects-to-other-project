import Project from '../../models/Project';
import Issue from '../../models/Issue';

export default interface IssueRepository {
  get(project: Project): Promise<Issue[]>;

  bulkUpdateProject(issues: Issue[], project: Project): Promise<void>;
}
