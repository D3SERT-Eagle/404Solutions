import React from "react";
import { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import "./fileupload.scss";

function FancyFileUpload(props) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setError("");
    if (props.onFileUpload) {
      props.onFileUpload(selectedFile); // only pass file
    }
  };

  const resetFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return React.createElement(
    "div",
    {
      className: "FancyUpload",
      onClick: function () {
        if (!uploading && fileInputRef.current) {
          fileInputRef.current.click();
        }
      },
    },
    !file &&
      !uploading &&
      React.createElement(CloudUploadIcon, { className: "UploadIcon" }),
    file &&
      !uploading &&
      React.createElement(CheckCircleIcon, { className: "CheckIcon" }),
    uploading && React.createElement("p", null, "Uploading..."),
    !file &&
      !uploading &&
      React.createElement("p", null, "Click to upload a file"),
    file &&
      !uploading &&
      React.createElement("p", null, "Uploaded: " + file.name),
    error && React.createElement("p", { className: "ErrorText" }, error),
    file &&
      !uploading &&
      React.createElement(CancelIcon, {
        className: "CancelIcon",
        onClick: function (e) {
          e.stopPropagation();
          resetFile();
        },
      }),
    React.createElement("input", {
      type: "file",
      ref: fileInputRef,
      onChange: handleFileChange,
      style: { display: "none" },
    })
  );
}

export default FancyFileUpload;
