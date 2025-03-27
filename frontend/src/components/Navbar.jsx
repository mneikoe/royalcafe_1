/*import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            Demo
          </Link>
        </div>

        
        <div className="flex space-x-4 items-center">
          
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => {
                const mobileMenu = document.getElementById("mobile-menu");
                mobileMenu.classList.toggle("hidden");
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          
          <div className="hidden md:flex space-x-4 items-center">
            {user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link to="/admin/register" className="hover:text-gray-300">
                  Register
                </Link>
                <Link to="/admin/menu" className="hover:text-gray-300">
                  Menu
                </Link>
                <Link to="/admin/instant" className="hover:text-gray-300">
                  Instant
                </Link>
              </>
            )}
            {user?.role === "student" && (
              <Link to="/student/dashboard" className="hover:text-gray-300">
                My Meals
              </Link>
            )}
            {user && (
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

    
      <div id="mobile-menu" className="hidden md:hidden mt-4 space-y-2">
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Dashboard
            </Link>
            <Link
              to="/admin/register"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Register
            </Link>
            <Link
              to="/admin/menu"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Menu
            </Link>
            <Link
              to="/admin/instant"
              className="block py-2 px-4 hover:bg-gray-700"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Instant
            </Link>
          </>
        )}
        {user?.role === "student" && (
          <Link
            to="/student/dashboard"
            className="block py-2 px-4 hover:bg-gray-700"
            onClick={() =>
              document.getElementById("mobile-menu").classList.add("hidden")
            }
          >
            My Meals
          </Link>
        )}
        {user && (
          <button
            onClick={() => {
              logout();
              document.getElementById("mobile-menu").classList.add("hidden");
            }}
            className="w-full text-left py-2 px-4 hover:bg-gray-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
*/
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiUserPlus,
  FiMenu,
  FiX,
  FiLogOut,
  FiCoffee,
  FiZap,
} from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo and Name */}
          <div className="flex-shrink-0 flex items-center ">
            <Link
              to="/"
              className="flex items-center text-xl font-bold hover:text-blue-300 transition-colors"
            >
              <img
                className="h-8 w-8 rounded-full shadow-sm"
                src="food_16224908.png"
                alt=" Logo"
              />
              <span className="hidden sm:inline ml-2">Royal Cafe</span>
              <span className="sm:hidden ml-2">R.C</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/dashboard" icon={<FiCoffee />}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/register" icon={<FiUserPlus />}>
                  Register
                </NavLink>
                <NavLink to="/admin/menu" icon={<FiMenu />}>
                  Menu
                </NavLink>
                <NavLink to="/admin/instant" icon={<FiZap />}>
                  Instant
                </NavLink>
              </>
            )}
            {user?.role === "student" && (
              <NavLink to="/student/dashboard" icon={<FiCoffee />}>
                My Meals
              </NavLink>
            )}
            {user && (
              <button
                onClick={logout}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-300 focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {user?.role === "admin" && (
            <>
              <MobileNavLink
                to="/admin/dashboard"
                icon={<FiCoffee className="mr-2" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                to="/admin/register"
                icon={<FiUserPlus className="mr-2" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </MobileNavLink>
              <MobileNavLink
                to="/admin/menu"
                icon={<FiMenu className="mr-2" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </MobileNavLink>
              <MobileNavLink
                to="/admin/instant"
                icon={<FiZap className="mr-2" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Instant
              </MobileNavLink>
            </>
          )}
          {user?.role === "student" && (
            <MobileNavLink
              to="/student/dashboard"
              icon={<FiCoffee className="mr-2" />}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Meals
            </MobileNavLink>
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-left text-base font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-blue-300 transition-colors"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
  >
    {icon}
    {children}
  </Link>
);
