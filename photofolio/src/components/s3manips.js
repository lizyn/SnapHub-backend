const AWS = require('aws-sdk');
const fs = require('fs');
// The access ID and secret key of the S3 bucket
const keys = require('./keys');

const { ID, SECRET } = keys;

// The name of the bucket that you have created
const BUCKET_NAME = 'cis557fall22';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

// upload a file
const uploadFile = async (file) => {
  const fileContent = fs.readFileSync(file.filepath);
  // const fileContent = fs.readFileSync(file);
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: file.originalFilename, // File name we want to upload
    Body: fileContent
  };

  // Uploading files to the bucket
  // const location = await s3.upload(params, (err, data) => {
  //   if (err) {
  //     return err;
  //   }
  //   console.log(`File uploaded successfully. ${data.Location}`);
  //   return data.Location;
  // });
  // console.log(location);
  // return location;

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data);
      }
    });
  });
};
// console.log(await uploadFile('cat.jpg'));

// read a file
const readFile = async (fileName) => {
  // Setting up S3 read parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName // File name we want to retrieve
  };

  // download file from the bucket
  s3.getObject(params, (err, data) => {
    if (err) {
      throw err;
    }
    // do something with the file
    const fStream = fs.createWriteStream(`1${fileName}`);
    fStream.write(data.Body);
    fStream.end();

    console.log(`File downloaded successfully. ${fileName}`);
  });
};

// readFile('cat.jpg');

// delete a file
const deleteFile = async (fileName) => {
  // Setting up S3 delete parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName // File name we want to delete
  };

  // download file from the bucket
  s3.deleteObject(params, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`File deleted successfully. ${data}`);
  });
};

// deleteFile('cat.jpg');

module.exports = { uploadFile, readFile, deleteFile };
