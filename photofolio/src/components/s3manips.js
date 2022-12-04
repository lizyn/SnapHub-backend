const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
// The access ID and secret key of the S3 bucket
const keys = require('./keys');

const { ID, SECRET } = keys;

// The name of the bucket that you have created
const BUCKET_NAME = 'cis557fall22';

const testFileName = 'testFile.jpg';
const testFilePath = path.join(__dirname, testFileName);
const testNullFileName = 'testFile.jpg+null';
const testNullFilePath = path.join(__dirname, testNullFileName);
const downloadDir = path.join(__dirname, '/test_download');

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const uploadFile = async (file) =>
  new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(file.filepath || file);
    // console.log(Buffer.byteLength(fileContent));
    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: file.originalFilename || path.parse(file).base, // File name we want to upload
      Body: fileContent
    };
    // console.log(params);
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data);
      }
    });
  });

// uploadFile(`${testFilePath}`)
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error.message));

const readFile = async (fileName, dir = downloadDir) => {
  // Setting up S3 read parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName // File name we want to retrieve
  };

  return new Promise((resolve, reject) => {
    // download file from the bucket
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // do something with the file
        const fStream = fs.createWriteStream(path.join(dir, `${fileName}`));
        fStream.write(data.Body);
        fStream.end();
        console.log(`File downloaded successfully. ${fileName}`);
        resolve(data);
      }
    });
  });
};

// readFile('null')
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error.message));

const deleteFile = async (fileName) => {
  // Setting up S3 delete parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName // File name we want to delete
  };

  return new Promise((resolve, reject) => {
    // delete file from the bucket
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // console.log(Object.keys(data));
        console.log(`File deleted successfully. ${JSON.stringify(data)}`);
        resolve(JSON.stringify(data));
      }
    });
  });
};

// deleteFile(1)
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error.message));

module.exports = { uploadFile, readFile, deleteFile };
