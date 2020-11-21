const core = require('@actions/core');
const github = require('@actions/github');
const { Buffer } = require('buffer');
const fileSystem = require('fs');
const request = require('request');

try {
    // Parameters
    const apiKey = core.getInput('mailgun-api-key');
    const domainName = core.getInput('mailgun-domain-name');
    const templateName = core.getInput('mailgun-template-name');
    const htmlFilePath = core.getInput('html-file-path');
    const mailgunHost = core.getInput('mailgun-host');
    const commitHash = github.context.sha;

    // Extract HTML content
    fileSystem.readFile(htmlFilePath, { encoding: 'utf-8' }, function (fileSystemError, html) {
        if (!fileSystemError) {
            console.log(`'${htmlFilePath}' sucessfully loaded.`);

            // Set up POST request
            var options = {
                'method': 'POST',
                'url': `https://${mailgunHost}/v3/${domainName}/templates/${templateName}/versions`,
                'headers': {
                    'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
                },
                formData: {
                    'tag': commitHash,
                    'template': html,
                    'engine': 'handlebars',
                    'active': 'true',
                    'comment': `Created by GitHub action upon pushing commit #${commitHash} to repository ${github.context.repo.repo}`
                }
            };

            // Create template version
            console.log(`Creating version for Mailgun template '${templateName}'...`);
            request(options, function (requestError, response) {
                if (requestError) throw new Error(requestError);
                if (response.statusCode != 200) throw new Error(`Template version could not be created:\nResponse: ${response.body}`);
                console.log(`Version successfully created.\nResponse: ${response.body}`);
            });
        } else {
            console.error(`ERROR: Did not find file ${htmlFilePath}`);
            throw fileSystemError;
        }
    });
} catch (error) {
    core.setFailed(error.message);
}