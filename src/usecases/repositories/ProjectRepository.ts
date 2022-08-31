import Project from "../../models/Project";

export default interface ProjectRepository {
    get(name: string): Promise<Project | undefined>
}
