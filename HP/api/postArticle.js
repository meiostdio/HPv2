const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
    const token = process.env.GITHUB_API_KEY;
    const owner = 'meiostdio';
    const repo = 'HPv2';
    const path = 'articles';
    let commitMessage = '';
    let sha = '';

    const octokit = new Octokit({
        auth: `token ${token}`,
    });
    
    //console.log(req.body);
    console.log("-------------------");
    try {
        const { data: files } = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        const fileNames = files.map(file => file.name);
        const nextFileName = `article${fileNames.length}.json`;
        console.log(nextFileName);

        commitMessage = `create ${nextFileName} from vercel serverless function`;

        // 既存のファイルがある場合はshaを取得する
        const { data } = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        const filePath = `${path}/${nextFileName}`;
        const fileContent = JSON.stringify(req.body, null, 2);
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
        console.log(error);
        res.status(500).send({ success: false, message: '記事データの保存に失敗しました', error: error});
    }
};