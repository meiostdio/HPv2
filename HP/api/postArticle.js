const { Octokit } = require("@octokit/rest");
const fs = require('fs');

module.exports = async (req, res) => {
    const githubToken = process.env.GITHUB_TOKEN;
    const owner = 'meiostdio';
    const repo = 'HPv2';
    const path = 'article';
    const commitMessage = '';

    const octokit = new Octokit({
        auth: githubToken,
    });

    try {
        const { data: files } = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        const fileNames = files.map(file => file.name);
        const nextFileName = `article${fileNames.length + 1}.json`;

        commitMessage = `create ${nextFileName} from vercel serverless function`;

        const filePath = `${dirPath}/${nextFileName}`;
        const fileContent = JSON.stringify({ key: 'value' }); // Replace with your JSON content
        const content = Buffer.from(fileContent).toString('base64');

        const response = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: filePath,
            message: commitMessage,
            content: content,
        });

        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};