/* eslint-disable react/jsx-no-target-blank */

import { useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIA3KZVK3RM6V72UAHV",
  secretAccessKey: "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",
  region: "ap-south-1",
  signatureVersion: "v4",
});

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [mobile, setmobile] = useState("");
  const [password, setpassword] = useState("");
  const [profilePicURL, setURL] = useState("");
  const [file, setFile] = useState(null);

  const s3 = new AWS.S3();

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToS3 = async () => {
    if (!file) {
      return;
    }
    const params = {
      Bucket: "equip9-testing",
      Key: `${Date.now()}_${file.name}`,
      Body: file,
    };
    const { Location } = await s3.upload(params).promise();
    setURL(Location);
    console.log("uploading to s3", Location);
  };

  return (
    <>
      <div className="mx-auto h-screen flex items-center justify-center bg-blue-300 w-full flex-col">
        <div
          id="card"
          className="rounded-md h-2/4 bg-white p-7 w-2/3 drop-shadow-xl"
        >
          <h1 className="text-5xl mb-5 text-center">Register</h1>
          <div className="flex-col flex px-8">
            <div className="flex flex-col mb-2">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="text"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="number"
                value={mobile}
                onChange={(e) => setmobile(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
            <input type="file" name="" id="" onChange={handleFileSelect} />
            {file && (
              <div style={{ marginTop: "10px" }}>
                <button onClick={uploadToS3}>Upload</button>
              </div>
            )}
            <button
              type="submit"
              className="py-2 rounded-md text-white mt-4 shadow-md bg-sky-500  w-20"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
