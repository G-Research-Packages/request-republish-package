const core = require('@actions/core');
const {create, UploadOptions} = require('@actions/artifact');
const github = require('@actions/github');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const glob = require('glob-promise');

(async () => {
    try {
        const packagePathPattern = core.getInput('package-path');

        const packagePathGlobs = await glob(packagePathPattern);
        if (packagePathGlobs.length == 0) {
            core.setFailed('Couldn\'t find a file matching ' + packagePathPattern + ' (did try glob expansion)');
            return;
        }
        if (packagePathGlobs.length > 1) {
            core.setFailed('Glob expansion of ' + packagePathPattern + ' found multiple files: ' + packagePathGlobs.join(', '));
            return;
        }
        const packagePath = packagePathGlobs[0];

        const packagePathParts = packagePath.split('/');
        const packageDir = packagePathParts.slice(0, packagePathParts.length - 1).join('/');
        const packageName = packagePathParts[packagePathParts.length - 1];

        console.log('Checking SHA256 of ' + packagePath);
        const {stdout} = await exec('sha256sum ' + packagePath);
        sha256 = stdout.slice(0, 64);
        console.log('SHA256 is ' + sha256);

        console.log('Uploading package as a GitHub artifact');
        const artifactClient = create();
        const uploadOptions = {continueOnError: false};
        const uploadResponse = await artifactClient.uploadArtifact(packageName, [packagePath], process.cwd() + '/' + packageDir);

        // This is the special log message which check-and-republish-package looks for.
        console.log('--- Uploaded package ' + packageName + ' as a GitHub artifact (SHA256: ' + sha256 + ') ---');
    } catch (error) {
        core.setFailed(error.message);
    }
})();
