import OctokitRepository from './OctokitRepository';

describe('OctokitRepository', () => {
  const ownerName = 'HiromiShikata';
  const repositoryName = 'npm-pkg-move-all-issues-in-projects-to-other-project';
  describe('constructor', () => {
    test('empty github token', () => {
      try {
        new OctokitRepository(ownerName, repositoryName, '');
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('no github token');
      }
    });
  });
});
