const { Octokit } = require("@octokit/rest");
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const token = process.env.GITHUB_API_KEY;
    const owner = 'meiostdio';
    const repo = 'HPv2';
    const path = 'articles';
    let commitMessage = '';
    let sha = '';

    // 認証に使用する変数
    let isAuthenticated;
    const pem = process.env.AUTH0_PEM;
    const authToken = req.headers.authorization.split(' ')[1];
    
    try {
        if(!authToken) {
            // ヘッダーにAuthorizationがない場合はエラーを返す
            res.status(401).send({ success: false, message: '認証されたユーザーではありません。' });
        }
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(authToken, pem, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                    isAuthenticated = true;
                }
            });
        });
    
        if (!isAuthenticated) {
            // 認証エラーのレスポンスを返す
            res.status(401).send({ success: false, message: '認証されたユーザーではありません。' });
        }

        // 認証されたユーザーの場合は記事データを保存する
        const octokit = new Octokit({
            auth: `token ${token}`,
        });
        
        //console.log(req.body);
        console.log("-------------------");
        try {
            // 既存のファイル名を取得し、次のファイル名を決定する
            const { data: files } = await octokit.repos.getContent({
                owner: owner,
                repo: repo,
                path: path,
            });
            const fileNames = files.map(file => file.name);
            const nextFileName = `article${fileNames.length}.json`;

            commitMessage = `create ${nextFileName} from vercel serverless function`;

            const filePath = `${path}/${nextFileName}`;
            const fileContent = JSON.stringify(req.body, null, 2);
            const content = Buffer.from(fileContent).toString('base64');

            // ファイルを新規作成してJSONデータを保存する
            await octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: filePath,
                message: commitMessage,
                content: content,
            });

            // artList.jsonを更新する
            const { data: artList } = await octokit.repos.getContent({
                owner: owner,
                repo: repo,
                path: 'articles/artList.json',
            });
            const artListContent = JSON.parse(Buffer.from(artList.content, 'base64').toString('utf8'));

            // リクエストのデータからartList.jsonに追加するデータを作成する
            const newArtList = {
                title: req.body.title,
                tag: req.body.tag,
                date: req.body.date,
                thumbnail: nextFileName.replace('.json', '.txt'),
                picture: req.body.picture,
                user: req.body.user,
            };
            // 作成した追加用のnewArtListを追加する
            const newArticleKey = 'article' + (Object.keys(artListContent).length + 1);
            artListContent[newArticleKey] = newArtList;
            console.log(artListContent);
            // 更新されたartList.jsonをエンコードして再度保存する
            const updatedContent = Buffer.from(JSON.stringify(artListContent, null, 2)).toString('base64');
            await octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: 'articles/artList.json',
                message: 'update artList.json from vercel serverless function',
                content: updatedContent,
                sha: artList.sha,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: '記事データの保存に失敗しました', error: error});
        }
        res.status(200).send({ success: true, message: '記事データを保存しました' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: '記事データの保存に失敗しました', error: error});
    }
    
};