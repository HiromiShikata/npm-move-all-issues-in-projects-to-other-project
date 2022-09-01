import OctokitProjectRepository from './OctokitProjectRepository';

describe('OctokitProjectRepository', () => {
  const ownerName = 'HiromiShikata';
  const repositoryName = 'npm-pkg-move-all-issues-in-projects-to-other-project';
  describe('constructor', () => {
    test('empty github token', () => {
      try {
        new OctokitProjectRepository(ownerName, repositoryName, '');
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('no github token');
      }
    });
  });
  describe('get', () => {
    const repo = new OctokitProjectRepository(
      ownerName,
      repositoryName,
      process.env.GH_TOKEN || '',
    );
    test.each`
      name                                      | expectedUndefined
      ${'Current - global'}                     | ${false}
      ${'UMINO FY202210'}                       | ${false}
      ${'V2 project on owner for testing'}      | ${false}
      ${'Classic project on owner for testing'} | ${false}
      ${`wrong project`}                        | ${true}
    `(
      `name: $name, expectedUndefined: $expectedUndefined`,
      async ({ name, expectedUndefined }) => {
        const res = await repo.get(name);
        if (expectedUndefined) expect(res).toBeUndefined();
        else expect(res).toBeDefined();
      },
    );
  });
});
