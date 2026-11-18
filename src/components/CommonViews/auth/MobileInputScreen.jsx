// src/components/CommonViews/AuthModal/MobileInputScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CountryDropdown from "./CountryDropdown";
import { isValidPhone } from "../../../utils/validatePhone";
import { getCountries } from "../../../utils/getCountries"; 
import tailwindStyles from "../../../utils/tailwindStyles";

const apiUrl = `${import.meta.env.VITE_API_URL}`;
const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const MobileInputScreen = ({
  isLogin, setIsLogin,
  isMobileConfirmed, setIsMobileConfirmed,
  afterLoginIsMobile, setAfterLoginIsMobile,
  afterLoginData, setAfterLoginData,
  setUserData, fetchUserListings, fetchActionsListings, fetchUserTransactions,
  navigate, onClose, triggerBy
}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmMobileNumber, setConfirmMobileNumber] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isConfirmDropdownOpen, setConfirmDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const confirmDropdownRef = useRef(null);

  const displayMessage = (type, text) => {
    window.dispatchEvent(new CustomEvent("showToast", { detail: { type, text } }));
  };

  // REUSE getCountries() – clean & consistent
  useEffect(() => {
    (async () => {
      const data = await getCountries();
      setCountries(data);
      const india = data.find(c => c.name === "India");
      if (india) setSelectedCountry(india);
    })();
  }, []);

  const fullMobile = selectedCountry?.code + mobileNumber;

  const handleMobileConfirm = async () => {
  
    if (!isValidPhone(selectedCountry?.iso, selectedCountry?.code, mobileNumber)) {
      displayMessage("error", "Please enter a valid mobile number!");
      setIsMobileValid(false);
      return;
    }
    if (mobileNumber !== confirmMobileNumber) {
      displayMessage("error", "Mobile numbers do not match!");
      setIsMobileValid(false);
      return;
    }
    try {
      await axios.post(`${apiUrl}/auth/checkMobile`, { mobile_no: fullMobile });
      displayMessage("success", "Mobile verified!");
      setIsMobileValid(true);
    } catch (err) {
      displayMessage("error", err.response?.data?.message || "Error");
      setIsMobileValid(false);
    }
  };

  useEffect(() => {
    if (confirmMobileNumber.length === 10) handleMobileConfirm();
  }, [confirmMobileNumber]);

  const handleContinue = () => {
    if (!isMobileValid) return displayMessage("error", "Please confirm your mobile number!");
    setIsMobileConfirmed(true);
    setIsLogin(false);
  };

  const submitMobileNumber = async () => {
    if (!isValidPhone(selectedCountry?.iso, selectedCountry?.code, mobileNumber)) return;
    try {
      await axios.put(`${apiUrl}/auth/addMobileNumber`, { id: afterLoginData.id, mobile_no: fullMobile });
      setAfterLoginIsMobile(false);
      await loginSuccess(afterLoginData);
    } catch {
      displayMessage("error", "Failed to save mobile");
    }
  };

  const loginSuccess = async (data) => {
    displayMessage("success", "Logged in!");
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

  return (
    <div className="flex flex-col items-center">
      <img src="/MOBILE.png" className="w-10 h-10 mb-2" alt="mobile_icon" />
      <h2 className={`${tailwindStyles.heading_2} mb-2`}>Mobile Number</h2>

      <div className="mb-4 min-w-[240px] lg:min-w-[280px]">
        <div className="flex items-center space-x-2 mb-2">
          <CountryDropdown
            dropdownRef={dropdownRef}
            isDropdownOpen={isDropdownOpen}
            setDropdownOpen={setDropdownOpen}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={e => setMobileNumber(e.target.value)}
            className={`${tailwindStyles.paragraph} w-[70%] px-2 h-8 border rounded-md`}
            maxLength={10}
          />
        </div>

        <div className="flex items-center space-x-2">
          <CountryDropdown
            dropdownRef={confirmDropdownRef}
            isDropdownOpen={isConfirmDropdownOpen}
            setDropdownOpen={setConfirmDropdownOpen}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <input
            type="tel"
            placeholder="Confirm Mobile Number"
            value={confirmMobileNumber}
            onChange={e => setConfirmMobileNumber(e.target.value)}
            className={`${tailwindStyles.paragraph} w-[70%] px-2 h-8 border rounded-md`}
            maxLength={10}
          />
        </div>
      </div>

      {afterLoginIsMobile ? (
        <button className={`${tailwindStyles.secondaryButton}`} onClick={submitMobileNumber}>
          Submit
        </button>
      ) : (
        <>
          <button className={`${tailwindStyles.secondaryButton}`} onClick={handleContinue}>
            Continue
          </button>
          <button className={`${tailwindStyles.heading_3} mt-2`} onClick={() => setIsLogin(true)}>
            Already have an account? <span className="text-[#ffc107]">Login</span>
          </button>
        </>
      )}
    </div>
  );
};

export default MobileInputScreen;