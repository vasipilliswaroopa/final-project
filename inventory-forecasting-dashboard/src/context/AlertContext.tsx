import React, { createContext, useContext, useState } from "react";
import Modal from "../components/Modal";

interface AlertContextType {
  showAlert: (title: string, message: string, type?: "success" | "error" | "info") => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const showAlert = (alertTitle: string, alertMessage: string, alertType: "success" | "error" | "info" = "info") => {
    setTitle(alertTitle);
    setMessage(alertMessage);
    setType(alertType);
    setIsOpen(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        message={message}
        type={type}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
