import { useDispatch } from "react-redux";
import SidebarItem from "../../utils/SidebarItem";
import { logoutUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const links = [
    {
      icon: "/sidebar/Home.svg",
      label: "Dashboard",
      to: "/dashboard/overview",
    },
    {
      icon: "/sidebar/Inventory.svg",
      label: "Inventory",
      to: "/dashboard/inventory",
    },
    {
      icon: "/sidebar/Reports.svg",
      label: "Reports",
      to: "/dashboard/reports",
    },
    {
      icon: "/sidebar/Suppliers.svg",
      label: "Suppliers",
      to: "/dashboard/suppliers",
    },
    { icon: "/sidebar/Orders.svg", label: "Orders", to: "/dashboard/orders" },
  ];

  const settingsLinks = [
    {
      icon: "/sidebar/Settings.svg",
      label: "Settings",
      to: "/dashboard/settings",
    },
    {
      icon: "/sidebar/LogOut.svg",
      label: "LogOut",
      to: "/login",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-full w-[25%] flex-col border-r border-gray-50 bg-white p-8 py-6 text-gray-600">
      <h2 className="mb-8 text-xl font-semibold text-blue-500">
        Inventory APP
      </h2>
      <div className="flex h-fit flex-col gap-2">
        {links.map((link) => (
          <SidebarItem
            key={link.to}
            icon={link.icon}
            label={link.label}
            to={link.to}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {settingsLinks.map((link) => (
          <SidebarItem
            key={link.to}
            icon={link.icon}
            label={link.label}
            to={link.to}
            onClick={link.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
