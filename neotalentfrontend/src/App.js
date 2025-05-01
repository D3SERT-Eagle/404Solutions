import Header from "./Components/Header/header";
import FancyFileUpload from "./Components/FileUploader/fileupload";
import SummaryDisplay from "./Components/SummaryDisplay/summarydisplay";
import Loader from "./Assets/loading-6324_512.gif";
import axios from "axios";
import "./App.scss";
import { Snackbar, Alert } from "@mui/material";
import { Textarea } from "@mui/joy";
import { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import SummaryHistory from "./Components/SummaryHistory/summary_history";
import DayMode from "./Assets/day-mode.png";
import NightMode from "./Assets/night-mode.png";
import StackIcon from "tech-stack-icons";
/*Fix file and loaders*/
const pb = new PocketBase(process.env.REACT_APP_POCKETBASE_EP);

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );
  const [filePresent, setFilePresent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingSum, setLoadingSum] = useState(false);
  const [loadingNut, setLoadingNut] = useState(false);
  const [loadingTra, setLoadingTra] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summary, setSummary] = useState(null);
  const [open, setOpen] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [translateText, setTranslateText] = useState(null);
  const [sourceLang, setSourceLang] = useState(null);
  const [targetLang, setTargetLang] = useState("");
  const [translationResult, setTranslationResult] = useState("");
  const [openError, setOpenError] = useState(false);
  const [sevLevel, setSevLevel] = useState("error");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      const hasToken =
        !!localStorage.getItem("token") || !!sessionStorage.getItem("token");
      setIsLoggedIn(hasToken);
    };

    window.addEventListener("token-change", handleStorageChange); // ← custom event
    window.addEventListener("storage", handleStorageChange); // ← cross-tab
    handleStorageChange();

    return () => {
      window.removeEventListener("token-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    //console.log(localStorage.getItem('overRideTheme'))
    if (
      localStorage.getItem("overRideTheme") === "false" ||
      localStorage.getItem("overRideTheme") === undefined
    ) {
      const time = new Date();
      const date = new Date(Number(time));
      let hours = date.getHours();
      if (hours >= 19 || hours < 7) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  }, []);

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    setFilePresent(true); // show "Summarize" button
  };

  const submitDocument = async () => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      //console.log(isLoggedIn)
      setOpen(true);
      return;
    }
    if (!selectedFile) return;
    setLoadingSum(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(
        "http://localhost:8000/summarize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `bearer ${
              localStorage.getItem("token")
                ? localStorage.getItem("token")
                : sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage(
        "File could not be parsed as it is too big. Try a smaller file please."
      );
      setSevLevel("error");
      setOpenError(true);
    } finally {
      setLoadingSum(false);
    }
  };

  const handleNutritionRequest = async () => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      //console.log(isLoggedIn)
      setOpen(true);
      return;
    }
    if (!nutrition) return;
    setLoadingNut(true);
    const data = { text: nutrition };
    try {
      const res = await axios.post("http://localhost:8000/calories", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            localStorage.getItem("token")
              ? localStorage.getItem("token")
              : sessionStorage.getItem("token")
          }`,
        },
      });
      setNutritionInfo(res.data.breakdown);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage(
        "We could not process your request at this time. Sorry, try again later."
      );
      setSevLevel("error");
      setOpenError(true);
    } finally {
      setLoadingNut(false);
    }
  };

  const handleTranslateRequest = async () => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      //console.log(isLoggedIn)
      setOpen(true);
      return;
    }
    if (!translateText) return;
    setLoadingTra(true);
    const data = {
      text: translateText,
      source_lang: sourceLang,
      target_lang: targetLang,
    };
    try {
      const res = await axios.post("http://localhost:8000/translate", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            localStorage.getItem("token")
              ? localStorage.getItem("token")
              : sessionStorage.getItem("token")
          }`,
        },
      });
      setTranslationResult(res.data.translated_text);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage(
        "We are unable to translate your text right now. Please try again later."
      );
      setSevLevel("error");
      setOpenError(true);
    } finally {
      setLoadingTra(false);
    }
  };

  const onHandleClose = () => {
    setOpen(false);
    setOpenError(false);
  };

  const handleNutrientsChange = (e) => {
    setNutrition(e.target.value);
  };

  const handleTextChange = (e) => {
    setTranslateText(e.target.value);
  };

  const handleModeChange = () => {
    if (theme === "dark") {
      localStorage.setItem("overRideTheme", "true");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      localStorage.setItem("overRideTheme", "true");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <div className={`App ${theme}`}>
      <Header />
      <div onClick={handleModeChange} className="ToggleModes">
        <img src={theme === "dark" ? DayMode : NightMode} />
      </div>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={onHandleClose}
        //message="⚠️Please Login or Register to use the component⚠️"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={sevLevel}>{errorMessage}</Alert>
      </Snackbar>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onHandleClose}
        //message="⚠️Please Login or Register to use the component⚠️"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning">
          Please Login or Register to use the component
        </Alert>
      </Snackbar>
      <div className="AppContent">
        <div className="Mission">
          <div className="StyledText">
            <h1>Who are we?</h1>
            <div className="Underline"></div>
          </div>
        </div>
        <div className="MissionStatement">
          <p id="MissionText">
            Our mission is to build AI tools that quietly — and occasionally
            brilliantly — improve your quality of life, from automating the
            mundane to enhancing everyday decision-making. We may have started
            as an error code, but we're here to deliver real answers. Try out
            some of our cutting-edge AI solutions below!
            <p style={{ color: theme === "dark" ? "#FFC1CC" : "#b39cd0" }}>
              To get started, click Login/Register in the top right corner.
            </p>
            Logging in allows us to personalize your experience. We do not
            collect your data. Promise. Sort of.
          </p>
        </div>
        <div className="DemoAISolutions">
          <div className="Summary">
            <h2 id="Description">Summarize PDFs</h2>
            <div style={{ height: "25%" }} className="CenteredDiv">
              <FancyFileUpload onFileUpload={handleFileUpload} />
            </div>
            {filePresent && !loadingSum ? (
              <div className="CenteredDiv">
                <button onClick={submitDocument} id="SummaryButton">
                  Summarize
                </button>
              </div>
            ) : null}
            {loadingSum && filePresent ? (
              <div className="CenteredDiv">
                <img style={{ width: "200px" }} src={Loader}></img>
              </div>
            ) : null}
            <div style={{ height: "65%" }} className="CenteredDiv">
              <div className="AIResponse">
                {summary ? <SummaryDisplay summary={summary} /> : null}
              </div>
            </div>
          </div>
          <div className="Nutrition">
            <h2 id="Description">Nutrition Info</h2>
            <div style={{ height: "25%" }} className="CenteredDiv">
              <Textarea
                sx={{ width: "100%" }}
                onChange={(e) => handleNutrientsChange(e)}
                minRows={4}
                placeholder="Tell me about your meal or the ingridients you are using..."
                size="lg"
                variant={theme === "dark" ? "solid" : "outlined"}
              />
            </div>
            {nutrition && !loadingNut ? (
              <div className="CenteredDiv">
                <button onClick={handleNutritionRequest} id="NutritionButton">
                  Tell me more
                </button>
              </div>
            ) : null}
            {loadingNut && nutrition ? (
              <div className="CenteredDiv">
                <img style={{ width: "200px" }} src={Loader}></img>
              </div>
            ) : null}
            <div style={{ height: "65%" }} className="CenteredDiv">
              <div className="AIResponse">
                {nutritionInfo ? (
                  <SummaryDisplay summary={nutritionInfo} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="Translator">
            <h2 id="Description">Translate Text</h2>

            <div style={{ height: "25%" }} className="CenteredDiv">
              <Textarea
                sx={{ width: "100%" }}
                onChange={(e) => handleTextChange(e)}
                minRows={4}
                placeholder='Write some text and I will translate it for you! For example, "Is it normal to be scared of ducks?"'
                size="lg"
                variant={theme === "dark" ? "solid" : "outlined"}
              />
            </div>
            <div>
              {translateText && !loadingTra ? (
                <div
                  className="CenteredDiv"
                  style={{ gap: "10px", flexDirection: "column" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <select
                      id="Source"
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                    >
                      <option value="null">Detect Language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ru">Russian</option>
                      {/* Add more as needed */}
                    </select>

                    <select
                      id="Target"
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ru">Russian</option>
                      {/* Add more as needed */}
                    </select>

                    <button
                      onClick={handleTranslateRequest}
                      id="TranslateButton"
                    >
                      Translate
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            {loadingTra && translateText ? (
              <div className="CenteredDiv">
                <img style={{ width: "200px" }} src={Loader} alt="Loading..." />
              </div>
            ) : null}

            <div style={{ height: "65%" }} className="CenteredDiv">
              <div className="AIResponse">
                {translationResult ? (
                  <SummaryDisplay summary={translationResult} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "90px" }} className="SummaryHistory">
          <div className="Mission">
            <div style={{ marginBottom: "20px" }} className="StyledText">
              <h1>Your saved summaries</h1>
              <div className="Underline"></div>
            </div>
          </div>
          {isLoggedIn ? (
            <SummaryHistory userId={localStorage.getItem("user_id")} />
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#ffc1cc",
                textDecoration: "underline",
              }}
            >
              Please log in to view your previously generated Summaries.
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
        className="techStack"
      >
        <h3 style={{ color: theme === "dark" ? "white" : "black" }}>
          Made With
        </h3>
        <StackIcon style={{ width: "20px" }} name="reactjs" />
        <StackIcon style={{ width: "20px" }} name="python" />
        <StackIcon style={{ width: "30px" }} name="go" />
        <StackIcon style={{ width: "30px" }} name="docker" />
      </div>
    </div>
  );
}

export default App;
