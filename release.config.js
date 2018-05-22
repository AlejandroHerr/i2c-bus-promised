module.exports = {
  analyzeCommits: {
    preset: 'angular',
    releaseRules: [
      { type: 'refactor', release: 'patch' },
      { type: 'Refactor', release: 'patch' },
      { type: 'Feat', release: 'minor' },
      { type: 'docs', release: 'patch' },
      { type: 'Docs', release: 'patch' },
      { type: 'Fix', release: 'patch' },
      { type: 'Perf', release: 'patch' },
      { type: 'Release', release: 'major' },
      { type: 'release', release: 'major' },
    ],
  },
  verifyConditions: [
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
  getLastRelease: '@semantic-release/npm',
  prepare: [
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      assets: ['package.json', 'API.md', 'CHANGELOG.md', 'README.md'],
      // eslint-disable-next-line no-template-curly-in-string
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    },
  ],
  publish: [
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
};
