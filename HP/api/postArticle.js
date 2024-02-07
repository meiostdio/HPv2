const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
    const githubToken = process.env.GITHUB_TOKEN;
    const owner = 'meiostdio';
    const repo = 'HPv2';
    const path = 'article';
    let commitMessage = '';

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

        const filePath = `${path}/${nextFileName}`;
        const fileContent = JSON.stringify(req.body);
        const content = Buffer.from(fileContent).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: filePath,
            message: commitMessage,
            content: content,
        });

        res.status(200).send({ success: true, message: '記事データを保存しました' });
    } catch (error) {
        res.status(500).send({ success: false, message: '記事データの保存に失敗しました', error: error});
    }
};