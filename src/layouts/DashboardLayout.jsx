import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Topbar from "../components/dashboard/Topbar";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileView />;
  }

  return (
    <div className="relative flex h-dvh w-dvw flex-row bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex h-full w-full flex-col overflow-scroll">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

const MobileView = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black px-6 text-white">
    <div className="max-w-lg rounded-lg bg-gray-900 p-6 shadow-lg">
      <p className="text-center text-lg leading-relaxed">
        This dashboard is optimized for larger screens. For the best experience,
        please use a laptop or desktop. If you want to access the user interface
        on mobile, click the button below.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          to="/"
          className="rounded-lg bg-white px-5 py-2 text-black transition hover:bg-gray-200"
        >
          Go to User
        </Link>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
