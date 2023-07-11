/* eslint-disable react/jsx-no-target-blank */

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { s3 } from "../utils/s3";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      password: "",
      fileName: "",
    },
  });
  const navigate = useNavigate();
  const watchFileName = watch("fileName");

  const uploadToS3 = async (fileName) => {
    if (!fileName[0]) {
      return;
    }

    const params = {
      Bucket: "equip9-testing",
      Key: fileName[0].name,
      Body: fileName[0],
    };

    await s3.upload(params).promise();
  };

  const onSubmit = async (data) => {
    const { firstName, lastName, mobile, password, fileName } = data;
    console.log({ data });
    if (fileName[0]) {
      await uploadToS3(fileName);
    }
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        firstName,
        lastName,
        mobile,
        password,
        profilePicture: fileName[0].name,
      }),
    };
    const res = await fetch("http://localhost:8000/register", config);
    const jsonResponse = await res.json();
    console.log({ jsonResponse });
    navigate("/login");
  };

  return (
    <>
      <div className="mx-auto h-screen flex items-center justify-center bg-blue-300 w-full flex-col">
        <div
          id="card"
          className="rounded-md h-auto bg-white p-7 w-2/3 drop-shadow-xl"
        >
          <h1 className="text-5xl mb-5 text-center">Register</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-col flex px-8"
          >
            <div className="flex flex-col mb-2">
              <label htmlFor="firstName">First Name</label>
              <input
                {...register("firstName", { pattern: /^[a-z]+$/i })}
                id="firstName"
                name="firstName"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="text"
              />
              {errors.firstName && (
                <span className="text-red-400">Enter valid name</span>
              )}
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                {...register("lastName", { pattern: /^[a-z]+$/i })}
                id="lastName"
                name="lastName"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="text"
              />
              {errors.lastName && (
                <span className="text-red-400">Enter valid name</span>
              )}
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                {...register("mobile", { pattern: /^\d{10}$/ })}
                id="mobile"
                name="mobile"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="number"
              />
              {errors.mobile && (
                <span className="text-red-400">
                  Enter a valid mobile number
                </span>
              )}
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="password">Password</label>
              <input
                {...register("password", { required: true, minLength: 5 })}
                id="password"
                name="password"
                className=" border border-slate-500 h-8 rounded-sm px-1"
                type="password"
              />
              {errors.password && (
                <span className="text-red-400">
                  Please enter a valid password with more than 5 characters
                </span>
              )}
            </div>
            <div className="flex mb-2">
              <input
                {...register("fileName", { required: true })}
                type="file"
                name="fileName"
                id="fileName"
              />
              {errors.fileName && (
                <span className="text-red-400">This is required</span>
              )}
              {watchFileName[0] && (
                <img
                  src={URL.createObjectURL(getValues("fileName")[0])}
                  alt="preview"
                  className="object-fill w-[100px] h-[100px]"
                />
              )}
            </div>

            <span></span>
            <button
              type="submit"
              className="py-2 rounded-md text-white mt-4 shadow-md bg-sky-500  w-20"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
