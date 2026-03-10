module.exports = {
    branches: ['production'],
    tagFormat: "v${version}",
    repositoryUrl: 'https://github.com/Ahmed-Elrayes/xSROMap.git',
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular', // Conventional commits
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'angular',
            },
        ],
        '@semantic-release/changelog',
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
                message: 'chore(release): ${nextRelease.version} [skip ci]',
            },
        ],
        '@semantic-release/github',
    ],
};