import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md p-2 transition-all hover:bg-blue-100 ${isActive ? "bg-blue-200" : "text-gray-600"}`
      }
    >
      <img src={icon} alt={label} />
      {label}
    </NavLink>
  );
};

export default SidebarItem;
