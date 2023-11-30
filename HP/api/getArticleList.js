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
        repository(owner: "meiostdio", name:"HPv2") {
        articleJson: object(expression: "main:articles/artList.json") {
            ... on Blob {
            text
            }
        }
        thumbnailImages: object(expression: "main:images/thumbnails/") {
            ... on Tree {
            entries {
                name
                object {
                ... on Blob {
                    byteSize
                    restContent: object(expression: "main:images/thumbnails/"${name}) {
                        ... on Blob {
                            text
                        }
                    }
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
    const jsonData = JSON.parse(jsonText);

    const images = [];
    data.repository.thumbnailImages.entries.forEach(entry => {
    if (entry.object && entry.object.text !== null) {
        images.push(entry.object.text);
    } else {
        console.warn('Skipping null or undefined entry:', entry);
    }
    images.push(entry.object.downloadUrl);
    });


    console.log('thumbnails :', images);
    res.status(200).json({
        data: {
        articles: {
            items: jsonData  
        },
        images: {
            items: images
        }
        }
    });

    }

