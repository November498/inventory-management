import React, { createContext, useState, useEffect } from "react";

const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarProvider };
