import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CookieConsent.css";

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookieConsent");

    if (!consent) {
      setVisible(true); // show directly
    }
  }, []);

  const sendConsent = async (type) => {
    try {
      await axios.post("http://localhost:5000/api/consent", {
        consent: type
      });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptAll = () => {
    setCookie("cookieConsent", "accepted", 365);
    sendConsent("accepted");
    setVisible(false);
  };

  const onlyNecessary = () => {
    setCookie("cookieConsent", "necessary", 365);
    sendConsent("necessary");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-wrapper">
      <div className="cookie-panel">

       <div className="cookie-header">
  <span className="cookie-icon">🔒</span>
  <h4>We respect your privacy</h4>
</div>
        <p>
          We use cookies to improve your experience, analyze traffic, and personalize content.
        </p>

        <div className="cookie-actions">
          <button className="btn-light" onClick={onlyNecessary}>
            Reject 
          </button>

          <button className="btn-dark" onClick={acceptAll}>
            Accept all
          </button>
        </div>

        <span className="close-btn" onClick={() => setVisible(false)}>✕</span>

      </div>
    </div>
  );
}