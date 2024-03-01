const { GraphQLClient, gql } = require('graphql-request')
const { Octokit } = require("@octokit/rest"); 

module.exports = async (req, res) => {
const endpoint = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
  }
})

const query = gql`
  query {
    repository(owner: "meiostdio", name: "HPv2") {
      articleJson: object(expression: "main:articles/artList.json") {
        ... on Blob {
          text
        }
      }
      thumbnailImages: object(expression: "main:images/thumbnails") {
        ... on Tree {
            entries {
                name
                object {
                    ... on Blob {
                        text
                    }
                }
            }
        }
      }
    }
  }
`;

    const data = await graphQLClient.request(query);

    const jsonText = data.repository.articleJson.text;
    let articleListData;
    try {
        articleListData = JSON.parse(jsonText);
    } catch (e) {
        console.log(e);
    }

    const images = {};
    data.repository.thumbnailImages.entries.forEach(entry => {
        images[entry.name] = entry.object.text; 
      });

    res.status(200).json({
        data: {
        articles: {
            items: articleListData 
        },
        images: {
            items: images
        }
        }
    });

}

