module.exports = {
  analyzeCommits: {
    preset: 'angukar',
    parserOpts: {
      headerPattern: /^(?::([\w-]*):)?\s*(\w*):\s*(.*)$/,
      headerCorrespondence: [
        'emoji',
        'tag',
        'message',
      ],
    },
    releaseRules: [
      { type: 'refactor', release: 'patch' },
    ],
  },
  generateNotes: {
    preset: 'angukar',
    parserOpts: {
      headerPattern: /^(?::([\w-]*):)?\s*(\w*):\s*(.*)$/,
      headerCorrespondence: [
        'emoji',
        'tag',
        'message',
      ],
    },
  },
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
  getLastRelease: '@semantic-release/npm',
  publish: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};
