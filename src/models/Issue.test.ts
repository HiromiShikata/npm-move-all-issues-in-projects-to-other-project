import Issue from './Issue';

describe('Issue', () => {
  test('new', () => {
    const issue = new Issue();
    expect(issue).toBeDefined();
  });
});
