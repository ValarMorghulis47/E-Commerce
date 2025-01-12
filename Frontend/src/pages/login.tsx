import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLoginUserMutation } from "../redux/api/userAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { UserResponse } from "../types/userAPI-types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../redux/reducers/userReducer";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginUserMutation();
  const dispatch = useDispatch();

  const loginHandler = async () => {

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      if (!user) return;

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        dob: date,
        _id: user.uid!,
        role: "user"
      })

      if ("data" in res && res.data?.success) { 
        toast.success(res.data.message);
        dispatch(userExist(res.data.user));
      }
      else {
        const error = res.error as FetchBaseQueryError;
        const errorMessage = (error.data as UserResponse).message;
        toast.error(errorMessage);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign in failed");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;