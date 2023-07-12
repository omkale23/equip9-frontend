import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getPreSignedURL } from "../utils/s3";

export const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData?.user?.firstName,
      lastName: userData?.user?.lastName,
    },
  });

  useEffect(() => {
    const config = {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("uId")}`,
      },
    };
    let isMounted = true;
    fetch("http://localhost:8000/my-profile", config)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) {
          setUserData(data);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uId");
    navigate("/", { replace: true });
  };

  const onSubmit = async (data) => {
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("uId")}`,
      },
      mode: "cors",
      body: JSON.stringify(data),
    };
    const res = await fetch("http://localhost:8000/edit-profile", config);
    const resData = await res.json();
    navigate(0);
  };
  return (
    <>
      <div className="flex items-center h-16 px-5 bg-sky-400">
        <div className="block grow"></div>
        <div
          onClick={handleLogout}
          className="text-xl rounded-lg bg-white text-sky-400 py-2 px-3 shadow-md cursor-pointer"
        >
          Logout
        </div>
      </div>
      <div className="mx-28">
        {userData && userData.user && (
          <div className="rounded-lg shadow-2xl flex flex-col justify-center items-center py-5 mt-8">
            <h1 className="text-4xl mb-4">
              Good Morning Mr. {userData?.user?.firstName}{" "}
              {userData?.user?.lastName}
            </h1>
            <h2 className="text-2xl mb-4">
              Here is your phone number: {userData?.user?.mobile}
            </h2>
            <p className="text-xl mb-4">Welcome to my page</p>
            <img
              src={getPreSignedURL(userData.user.profilePicture)}
              alt="profile"
              className="w-[300px] h-[300px]"
            />
          </div>
        )}
        <div className="flex items-center justify-center">
          <div
            onClick={() => setShow(!show)}
            className="text-xl rounded-lg bg-sky-400 text-white py-2 px-3 shadow-md cursor-pointer mt-10"
          >
            Edit Details
          </div>
        </div>
        {show && (
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
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
              <button className="text-xl rounded-lg bg-sky-400 text-white py-1 px-2 shadow-md cursor-pointer mt-10">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};