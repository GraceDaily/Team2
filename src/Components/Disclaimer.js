import React, { useEffect, useState } from "react";

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("disclaimerDismissed");
    if (!dismissed) {
      setIsOpen(true);
    } else {
      setWasDismissed(true);
    }
  }, []);

  const closeWarning = () => {
    setIsOpen(false);
    setWasDismissed(true);
    localStorage.setItem("disclaimerDismissed", "true");
  };

  const reopenDisclaimer = () => {
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#343434",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "50%",
            height: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <h2>Disclaimer</h2>
          <p>
            This site may contain adult content and/or images. Viewers must be
            over the age of 18.
          </p>
          <button
            onClick={closeWarning}
            style={{
              padding: "10px 20px",
              backgroundColor: "#FB0707",
              color: "white",
              borderRadius: "10px",
              border: "none",
              marginTop: "20px",
            }}
          >
            I understand
          </button>
        </div>
      )}

      {/* Reopen icon */}
      {!isOpen && wasDismissed && (
        <button
          onClick={reopenDisclaimer}
          title="Open disclaimer"
          style={{
            position: "fixed",
            top: "22px", // adjust depending on your navbar height
            left: "20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#343434",
            color: "white",
            fontSize: "20px",
            border: "none",
            cursor: "pointer",
            zIndex: 1001,
          }}
        >
        !
        </button>
      )}
    </>
  );
}

export default Disclaimer;
