import { ManagementClient } from "auth0"

module.exports = async (req, res) => {
    // リクエストから編集する内容を取得
    const target = req.query.target;
    const value = req.query.value;
    const userid = req.query.userid;

    const metadata = { 
        [`${ target }`]:  [`${value}`]
    };

    console.log('updateUser!');

    // Auth0をインスタンス化
    let ManagementClient = require('auth0').ManagementClient;
    let auth0 = new ManagementClient({
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        scope: 'create:users read:users update:users'
    });

    // ユーザー情報を編集
    auth0.users.update( userid, metadata, function( error, user ){
        if (error) {
            console.log('ユーザー編集のエラー: ', error);
            res.status(500).send({ error: 'Internal Server Error : User update faild' });
        } else {
            const userJson = JSON.stringify(user);
            res.status(200).json(userJson);
        }
    });
}