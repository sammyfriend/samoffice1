import React, { useEffect, useState } from "react";
import "./App.css";
import Logo from "./assets/bannerlogo.png";
import { Email } from "./components/Email";
import { Loader } from "./components/Loader";

const App = () => {
  const [showLoader, setShowLoader] = useState(true); // Show loader first

  const handleNext = (email) => {
    console.log("Email submitted:", email);
    // You can handle form submission here
  };

  useEffect(() => {
    // Simulate loading (e.g. fetching config, animating, etc.)
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // Show loader for 3 seconds

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <div className="major-container">
      <br />
      <div className="container">
        <img src={Logo} alt="logo" className="logo" />
        <div className="form-wrapper">
          {showLoader ? <Loader /> : <Email onNext={handleNext} />}
        </div>
      </div>

      <div className="footer">
        <a href="#">Terms of use</a>
        <a href="#">Privacy & cookies</a>
        <a href="#" className="dot">•••</a>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default App;
