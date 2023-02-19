const path = require('path');
const s3manips = require('../components/s3manips');

describe('s3 upload/download/delete file test', () => {
  const testFileName = 'testFile.jpg';
  const testNullFileName = 'testFile.jpg+null';
  const testFilePath = path.join(__dirname, testFileName);
  const testNullFilePath = path.join(__dirname, testNullFileName);
  const downloadDir = path.join(__dirname, '/test_download');
  beforeAll(async () => {
    console.log = () => {};
  });

  afterAll(async () => {});
  beforeEach(() => jest.setTimeout(100));

  test('upload file', async () => {
    const promise = s3manips.uploadFile(testFilePath);
    await expect(
      await promise.then((data) => {
        console.log(data.Location);
        return data.Location;
      })
    ).not.toBeUndefined();
  });

  test("upload file that doesn't exist", async () => {
    const promise = s3manips.uploadFile(testNullFilePath);
    await expect(promise).rejects.toThrow();
  });

  test('download file', async () => {
    const promise = s3manips.readFile(testFileName, downloadDir);
    await expect(
      await promise.then((data) => {
        console.log(data.ContentLength);
        return data.ContentLength;
      })
    ).toBeGreaterThan(-1);
  });

  test("download file that doesn't exist", async () => {
    const promise = s3manips.readFile(testNullFilePath, downloadDir);
    await expect(promise).rejects.toThrow();
  });

  test('delete file', async () => {
    const promise = s3manips.deleteFile(testFileName);
    await expect(promise).resolves.not.toThrow();
  });

  test("delete a non-existent file doesn't cause error", async () => {
    const promise = s3manips.deleteFile(testNullFileName);
    await expect(promise).resolves.not.toThrow();
  });

  test('invalid arg for s3', async () => {
    const promise1 = s3manips.uploadFile({
      originalFilename: 123,
      filepath: testFilePath
    });
    await expect(promise1).rejects.toThrow();
    const promise2 = s3manips.deleteFile(123);
    await expect(promise2).rejects.toThrow();
  });
});
