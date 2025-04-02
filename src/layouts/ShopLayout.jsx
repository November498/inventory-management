import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaGrin, FaArchive } from "react-icons/fa";
import {
  IoHome,
  IoSearch,
  IoBasketSharp,
  IoPersonCircle,
  IoLogInOutline,
  IoBagHandle,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";

const ShopLayout = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackNavigation = () => {
    navigate(window.history.state.idx > 2 ? -1 : "/");
  };

  const renderNavLink = (to, Icon, additionalCondition = true) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive && additionalCondition ? "text-3xl text-blue-500" : "text-3xl"
      }
    >
      <Icon />
    </NavLink>
  );

  return (
    <div>
      {/* Header */}
      <header className="fixed top-0 z-50 w-dvw bg-white px-4 pb-4 pt-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {location.pathname === "/" ? (
              <IoBagHandle className="text-2xl" />
            ) : (
              <button onClick={handleBackNavigation} className="text-2xl">
                <IoArrowBackOutline />
              </button>
            )}
            <NavLink to="/" className="text-xl font-semibold hover:underline">
              bagzz
            </NavLink>
          </div>
          <nav className="flex items-center">
            {userInfo ? (
              <div className="flex gap-2">
                <NavLink to="/user" className="hover:underline">
                  <FaGrin className="text-xl" />
                </NavLink>
                <NavLink to="/dashboard/overview" className="hover:underline">
                  <FaArchive className="text-xl" />
                </NavLink>
              </div>
            ) : (
              <NavLink to="/login" className="mr-4 hover:underline">
                <IoLogInOutline className="text-2xl" />
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 pt-12">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-2 z-20 h-fit w-full p-2 lg:inset-x-0 lg:m-auto lg:w-1/2">
        <div className="flex h-fit items-center justify-around rounded-full bg-white py-4 shadow-2xl lg:gap-8">
          {renderNavLink("/", IoHome)}
          {renderNavLink("/products", IoSearch)}
          {renderNavLink("/user/cart", IoBasketSharp)}
          {renderNavLink(
            "/user",
            IoPersonCircle,
            location.pathname === "/user",
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopLayout;
