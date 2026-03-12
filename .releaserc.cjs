/**
 * Semantic Release Configuration
 * Configured to bump patch version (e.g., 1.4.0 -> 1.4.1)
 * 
 * Commit format: type(scope): message
 * Examples:
 *   fix: resolve build error
 *   feat: add new feature
 *   chore: update dependencies
 */
module.exports = {
  branches: ['production'],
  plugins: [
    // Analyze commits - treat all commits as patch releases
    ['@semantic-release/commit-analyzer', {
      preset: 'conventionalcommits',
      releaseRules: [
        // All commit types trigger a patch release
        { type: 'feat', release: 'patch' },
        { type: 'fix', release: 'patch' },
        { type: 'perf', release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { type: 'style', release: 'patch' },
        { type: 'docs', release: 'patch' },
        { type: 'chore', release: 'patch' },
        { type: 'build', release: 'patch' },
        { type: 'ci', release: 'patch' },
        { type: 'test', release: 'patch' },
        { type: 'revert', release: 'patch' },
        // Breaking changes still bump major
        { breaking: true, release: 'major' },
      ],
    }],
    // Generate release notes
    ['@semantic-release/release-notes-generator', {
      preset: 'conventionalcommits',
      presetConfig: {
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'perf', section: 'Performance' },
          { type: 'refactor', section: 'Refactoring' },
          { type: 'docs', section: 'Documentation' },
          { type: 'chore', section: 'Chores' },
          { type: 'build', section: 'Build' },
          { type: 'ci', section: 'CI' },
          { type: 'style', section: 'Styles' },
          { type: 'test', section: 'Tests' },
          { type: 'revert', section: 'Reverts' },
        ],
      },
    }],
    // Update CHANGELOG.md
    '@semantic-release/changelog',
    // Update package.json version and publish to npm
    '@semantic-release/npm',
    // Commit the changed files
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    }],
    // Create GitHub release
    '@semantic-release/github',
  ],
};
