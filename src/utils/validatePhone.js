



// src/utils/validatePhone.js
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * @param {string} iso   – "IN", "US", …
 * @param {string} code  – "+91", "+1", …
 * @param {string} num   – "9876543210"
 */
export function isValidPhone(iso, code, num) {
  if (!iso || !code || !num) return false;

  const clean = num.replace(/\D/g, "");
  const full = `${code}${clean}`;

  try {
    const parsed = phoneUtil.parse(full, iso);
    if (phoneUtil.isValidNumber(parsed)) {
      if (iso === "IN") return clean.length === 10 && /^[6-9]/.test(clean);
      return true;
    }

    // fallback for India
    if (iso === "IN") return clean.length === 10 && /^[6-9]/.test(clean);
    return false;
  } catch {
    if (iso === "IN") return clean.length === 10 && /^[6-9]/.test(clean);
    return false;
  }
}

// utils/validatePhone.js
// import { PhoneNumberUtil } from "google-libphonenumber";

// const phoneUtil = PhoneNumberUtil.getInstance();

// export function isValidPhone(iso, code, num) {
//   if (!iso || !code || !num) return false;

//   const clean = num.replace(/\D/g, "");
//   const full = code + clean; // e.g. +919876543210

//   // India: strict 10-digit rule
//   if (iso === "IN") {
//     return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
//   }

//   // For other countries: use libphonenumber
//   try {
//     const parsed = phoneUtil.parse(full, iso);
//     return phoneUtil.isValidNumber(parsed);
//   } catch (error) {
//     return false;
//   }
// }