import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { jwtDecode } from "jwt-decode";
import "./modal.scss";
import axios from "axios";

function Modal({ onSubmitClose }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [validLength, setValidLength] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [unmatchedPasswords, setUnmatchedPasswords] = useState(false)

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setRegister(true);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setRegister(false);
  };

  const validateForm = () => {
    const emailValid = isValidEmail(email);
    const passwordsMatch = password === confirm;
    const passwordsLongEnough = password.length >= 8 && confirm.length >= 8;
  
    setValidEmail(emailValid);
    setUnmatchedPasswords(!passwordsMatch);
    setValidLength(passwordsLongEnough);
    setDisplayError(!(emailValid && passwordsMatch && passwordsLongEnough));
  
    if (emailValid && passwordsMatch && passwordsLongEnough) {
      return true;
    }
  
    return false;
  };

  const handleRegisterUser = async () => {
    const url = "http://localhost:8000/auth/register";
    const user = { email, password };
    if (!validateForm()) {
      return; // block form submission
    }
    try {
      const register = await axios.post(url, user, {
        headers: { ContentType: "application/json" },
      });
      onSubmitClose("success", "Registered user. Please Login 😊");
    } catch (e) {
      console.warn(e);
      onSubmitClose("error", "Error: Could not register user ☹️");
    }
  };

  const handleLoginUser = async () => {
    const url = "http://localhost:8000/auth/login";
    const user = { email, password };
    if (!isValidEmail(email)) {
      setValidEmail(false);
      return;
    }

    try {
      const login = await axios.post(url, user, {
        headers: { ContentType: "application/json" },
      });
      if (login.status === 200 || login.status === 201) {
        const decoded = jwtDecode(login.data.access_token);
        //console.log(decoded);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("token", login.data.access_token);
          window.dispatchEvent(new Event("token-change"));
        } else {
          localStorage.removeItem("rememberedEmail");
          sessionStorage.setItem("token", login.data.access_token);
          window.dispatchEvent(new Event("token-change"));
        }

        localStorage.setItem("user_id", decoded.uid);
        localStorage.setItem("email", decoded.sub);

        onSubmitClose("success", "Login successful 😊");
      }
    } catch (e) {
      console.warn(e);
      onSubmitClose("error", "Login attempt failed ☹️");
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(regex.test(email));
    return regex.test(email);
  };

  const updateEmail = (e) => setEmail(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);
  const updateConfirm = (e) => setConfirm(e.target.value);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleLoginUser();
    }
  };

  return ReactDOM.createPortal(
    <div className="Modal">
      <div className="LoginRegisterContainer">
        <TextField
          value={email}
          onChange={updateEmail}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="email"
          error={!validEmail}
        />

        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            onKeyDown={(e) => handleEnterKey(e)}
            onChange={updatePassword}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        {register && (
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-confirm">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              error={!validLength}
              onKeyDown={(e) => handleEnterKey(e)}
              onChange={updateConfirm}
              id="outlined-adornment-confirm"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
        )}

        {displayError ? (
          <p style={{ margin: 0, color: "red", fontSize: "small" }}>
            Invalid Email or Password format.
          </p>
        ) : null}

        {unmatchedPasswords ? (
          <p style={{ margin: 0, color: "red", fontSize: "small" }}>
            Passwords do not match.
          </p>          
        ) : null}

        {!register?
        <FormControlLabel
          control={
            <Checkbox checked={rememberMe} onChange={handleRememberMeChange} />
          }
          label="Remember me"
        />
        :null}

        {register ? (
          <a onClick={handleLoginClick} id="Register">
            Login?
          </a>
        ) : (
          <a onClick={handleRegisterClick} id="Register">
            New User?
          </a>
        )}

        {register ? (
          <Button onClick={handleRegisterUser} variant="outlined">
            Register
          </Button>
        ) : (
          <Button onClick={handleLoginUser} variant="outlined">
            Log in
          </Button>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
