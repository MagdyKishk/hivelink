import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../store";
import NavProfileDropDown from "../../common/Nav/NavProfileDropDown";
import Button from "../../common/Button";
import { cn } from "../../../utils/cn";

/**
 * Navigation bar component that provides site-wide navigation and user menu
 * Features:
 * - Brand logo/link
 * - Main navigation links (Feed, Explore)
 * - Authentication controls (Login/Signup) for unauthenticated users
 * - User profile dropdown menu for authenticated users
 */
const Navbar = () => {
    const { isAuthenticated, checkedAuth } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* LeftSide: Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link 
                            to={""}
                            className="flex items-center space-x-2 transition-colors duration-200"
                        >
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700">
                            LucidRealm
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Main Navigation */}
                    <div className="hidden sm:flex items-center justify-center flex-1 px-2 lg:ml-6 lg:justify-center">
                        <div className="flex space-x-8">
                            <NavLink 
                                to={""} 
                                className={({ isActive }) => cn(
                                    "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                                    "border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-600",
                                    isActive ? "border-indigo-500 text-indigo-600" : "text-gray-500"
                                )}
                            >
                                Feed
                            </NavLink>
                            <NavLink 
                                to={"/explore"} 
                                className={({ isActive }) => cn(
                                    "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                                    "border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-600",
                                    isActive ? "border-indigo-500 text-indigo-600" : "text-gray-500"
                                )}
                            >
                                Explore
                            </NavLink>
                        </div>
                    </div>

                    {/* RightSide: Authentication Controls or User Menu */}
                    <div className="flex items-center lg:ml-6">
                        {(isAuthenticated && checkedAuth) ? (
                            <NavProfileDropDown />
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to={"/login"}>
                                    <Button 
                                        variant="ghost"
                                        className="text-gray-600 hover:text-indigo-600"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to={"/signup"}>
                                    <Button 
                                        variant="default"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
