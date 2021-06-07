const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new S3Client({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: 'eu-west-2',
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const fileType = req.query.fileType;

    const key = `${req.user.id}/${uuid()}`;

    const command = new PutObjectCommand({
      Bucket: 'nodecourse-blog-bucket',
      Key: key,
      ContentType: fileType,
    });
    try {
      const url = await getSignedUrl(s3, command);
      res.send({ key, url });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  });
};
