import React, { useState, useEffect, useRef } from "react";

function SummaryDisplay({ summary }) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!summary) return;
    indexRef.current = 0;
    setDisplayedText("");
    const delayTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const nextChar = summary[indexRef.current];
        if (nextChar !== undefined) {
          setDisplayedText((prev) => prev + nextChar);
          indexRef.current += 1;
        } else {
          clearInterval(intervalRef.current);
        }
      }, 20);
    }, 20);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(delayTimeout);
    };
  }, [summary]);
  return React.createElement(
    "div",
    { className: "" },
    displayedText
      ? React.createElement("p", { style: { margin: 0 } }, displayedText)
      : null
  );
}

export default SummaryDisplay;