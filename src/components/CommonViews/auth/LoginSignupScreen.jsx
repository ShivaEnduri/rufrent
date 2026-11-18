// src/components/CommonViews/AuthModal/LoginSignupScreen.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase";
import Cookies from "js-cookie";
import tailwindStyles from "../../../utils/tailwindStyles";

const apiUrl = `${import.meta.env.VITE_API_URL}`;
const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const LoginSignupScreen = ({
  isLogin, setIsLogin,
  selectedCountry, mobileNumber,
  setAfterLoginData, setAfterLoginIsMobile,
  setUserData, fetchUserListings, fetchActionsListings, fetchUserTransactions,
  navigate, onClose, triggerBy, referralCode
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const displayMessage = (type, text) => {
    window.dispatchEvent(new CustomEvent("showToast", { detail: { type, text } }));
  };

  const loginSuccess = async (data) => {
    displayMessage("success", "Success!");
    const role = (data.role || "user").toLowerCase();
    await setUserData({ id: data.id, role, userName: data.username });
    await Promise.all([
      fetchUserListings(data.id),
      fetchActionsListings(data.id),
      fetchUserTransactions(data.id)
    ]);
    Cookies.set(jwtSecretKey, data.token, { expires: 1 });
    navigate(triggerBy !== "/" ? triggerBy : "/");
    onClose();
  };

  const handleSignup = async () => {
    if (!name || password !== confirmPassword) return displayMessage("error", "Invalid input");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      const res = await axios.post(`${apiUrl}/auth/signup`, {
        uid: cred.user.uid, email, token: cred._tokenResponse.idToken,
        displayName: name, mobile_no: selectedCountry?.code + mobileNumber,
        role_id: 2, referredBy: referralCode
      });
      if (res.status === 201) {
        displayMessage("success", "Signed up!");
        setIsLogin(true);
      }
    } catch (e) { displayMessage("error", e.message); }
  };

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) return displayMessage("error", "Verify email");
      const res = await axios.post(`${apiUrl}/auth/login`, {
        token: cred._tokenResponse.idToken, uid: cred.user.uid
      });
      const data = res.data;
      if (!data.isMobile) {
        setAfterLoginData(data); setAfterLoginIsMobile(true);
      } else {
        await loginSuccess(data);
      }
    } catch (e) { displayMessage("error", e.message); }
  };

  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const resp = await axios.post(`${apiUrl}/auth/g_login`, {
        uid: user.uid, email: user.email, displayName: name || user.displayName,
        mobile_no: selectedCountry?.code + mobileNumber || user.phoneNumber,
        token: res._tokenResponse.idToken, role_id: 2, referredBy: referralCode
      });
      const data = resp.data;
      if (!data.isMobile) { setAfterLoginData(data); setAfterLoginIsMobile(true); }
      else { await loginSuccess(data); }
    } catch (e) { displayMessage("error", e.message); }
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <img src={isLogin ? "/LOGIN.png" : "/SIGNUP.png"} className="w-10 h-10 mb-2" alt="icon" />
        <h2 className={`${tailwindStyles.heading_2} mb-2`}>{isLogin ? "Welcome" : "Create Account"}</h2>
      </div>

      {!isLogin && (
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
          className={`${tailwindStyles.paragraph} w-full px-2 border rounded-md h-8 mb-2`} />
      )}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        className={`${tailwindStyles.paragraph} w-full px-2 border rounded-md h-8 mb-2`} />
      <input type={showPassword ? "text" : "password"} placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)}
        className={`${tailwindStyles.paragraph} w-full px-2 border rounded-md h-8 mb-2`} />
      {!isLogin && (
        <input type="password" placeholder="Confirm Password" value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className={`${tailwindStyles.paragraph} w-full px-2 border rounded-md h-8 mb-2`} />
      )}

      {isLogin && (
        <div className="w-full flex justify-between mb-2">
          <div className={`${tailwindStyles.paragraph} flex items-center space-x-2`}>
            <input type="checkbox" id="show" onChange={() => setShowPassword(v => !v)} />
            <label htmlFor="show">Show Password</label>
          </div>
          <span className="text-[10px] lg:text-xs 2xl:text-md text-blue-500 cursor-pointer hover:underline"
            onClick={async () => {
              if (!email) return displayMessage("error", "Enter email");
              await sendPasswordResetEmail(auth, email);
              displayMessage("success", "Reset email sent");
            }}>Forgot Password?</span>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <button className={`${tailwindStyles.secondaryButton} mt-2`}
          onClick={isLogin ? handleLogin : handleSignup}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button className={`${tailwindStyles.heading_3}`} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? <>Don't have an account? <span className="text-[#ffc107]">Sign up</span></>
                   : <>Already have an account? <span className="text-[#ffc107]">Login</span></>}
        </button>
      </div>

      <div className="flex items-center justify-center my-2">
        <div className="flex-1 h-0.5 bg-gray-200"></div>
        <span className="mx-2 pb-1 text-gray-400">or</span>
        <div className="flex-1 h-0.5 bg-gray-200"></div>
      </div>

      <button className="border rounded-md h-8 w-full flex items-center justify-center gap-2"
        onClick={handleGoogle}>
        <img src="/GOOGLE.png" alt="Google" className="w-5 h-5 bg-white rounded-full" />
        <p className={`${tailwindStyles.paragraph_b}`}>Continue With Google</p>
      </button>
    </div>
  );
};

export default LoginSignupScreen;