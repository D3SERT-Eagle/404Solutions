import { useState, useEffect } from "react";
import Modal from "../Modal/modal";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";
import "./header.scss";

function Header() {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const scrollToTop = (e) => {
    e.preventDefault();
    const app = document.querySelector(".App");
    if (app) {
      app.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = (e) => {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
    e.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = (severity, message) => {
    setOpenModal(false);
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  const onHandleClose = () => {
    setOpen(false);
  };

  return (
    <div className="Header">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={onHandleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>

      {openModal ? <Modal onSubmitClose={handleCloseModal} /> : null}

      <div className="HeaderContent">
        <h1 id="CompanyLogo">404 Solutions</h1>
        <div className="Controls">
          <a onClick={scrollToTop} id="navlink" href="">
            Home
          </a>
          <a onClick={(e) => { e.preventDefault(); setShowAbout(true); }} id="navlink" href="">
            About
          </a>
          <a onClick={(e) => { e.preventDefault(); setShowContact(true); }} id="navlink" href="">
            Contact
          </a>
          <a onClick={handleLogin} id="navlink" href="">
            {localStorage.getItem("token") || sessionStorage.getItem("token")
              ? "Logout"
              : "Login/Register"}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;

function AboutModal({ onClose }) {
  return (
    <div className="SimpleModal" onClick={onClose}>
      <div className="SimpleModalContent" onClick={(e) => e.stopPropagation()}>
        <h2>About Us</h2>
        <p>
          At 404 Solutions, we use AI to take care of the small things — like reading long PDFs, guessing what you meant to say, or figuring out how many calories were in that “light snack.”
          We’re not solving all of humanity’s problems (yet), but we’re definitely saving you a few clicks.{" "}
          <br />
          <br />
          At 404 Solutions, we believe AI can solve all problems — including the ones it causes.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function ContactModal({ onClose }) {
  return (
    <div className="SimpleModal" onClick={onClose}>
      <div className="SimpleModalContent" onClick={(e) => e.stopPropagation()}>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:nikitasinha771@gmail.com">nikitasinha771@gmail.com</a></p>
        <p>Phone / WhatsApp: <a href="tel:+19086132861">+1 (908) 613 2861</a></p>
        <p>Telegram: <a target="_blank" href="https://t.me/niko1668">Niko</a></p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
