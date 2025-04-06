import { useState, useEffect } from "react";
import "../styles/InstallApp.css";

const InstallApp = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowToast(true);

      setTimeout(() => {
        handleClose();
      }, 7000);
    };

    const handleAppInstalled = () => {
      handleClose();
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowToast(false);
      setIsClosing(false);
    }, 700);
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setInstallPrompt(null);
    handleClose();
  };

  if (!showToast) return null;

  return (
    <div className={`toast-container ${isClosing ? "closing" : ""}`}>
      <div className="toast-box">
        <div className="accent-bar" />
        <div className="toast-content">
          Install Trusten.Vision
          <div className="toast-actions">
            <button className="btn-secondary" onClick={handleClose}>
              Not now
            </button>
            <button className="btn-primary" onClick={handleInstallClick}>
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;
