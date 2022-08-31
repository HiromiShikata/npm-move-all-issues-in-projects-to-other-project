import Project from './Project';

describe('Project', () => {
  test('new', () => {
    const project = new Project();
    expect(project).toBeDefined();
  });
});
