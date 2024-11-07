// React
import { useEffect } from "react";

// Pages

// Components
import Navbar from "./components/layouts/General/Navbar";

// Routes
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RoutesList from "./constants/Routes/RoutesList";
import { useAuth } from "./store";

// Animation
import RedirectAnimation from "./animations/redirect/animation";
import { AnimationType } from "@/constants/components/RedirectAnimation.types";
import SignupPage from "./components/pages/SignupPage";
import LoginPage from "./components/pages/LoginPage";

function App() {
  const { checkAuth, checkedAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth()
  },[checkAuth])
  
  useEffect(() => {
    if (checkedAuth && !isAuthenticated && 
        location.pathname !== RoutesList.auth.login && 
        location.pathname !== RoutesList.auth.signup) {
      navigate(RoutesList.auth.login);
    }
  }, [checkedAuth, isAuthenticated, navigate, location])

  return (
    <div className="bg-gray-100 text-gray-950 min-h-screen">
      {!checkedAuth && <RedirectAnimation animationType={AnimationType.still} />}
      {checkedAuth && <RedirectAnimation animationType={AnimationType.out} />}
      <Navbar />
      <Routes>
        <Route path={RoutesList.home} element={<h1>Home</h1>}/>
        <Route path={RoutesList.auth.login} element={<LoginPage />} />
        <Route path={RoutesList.auth.signup} element={<SignupPage />}/>
        <Route path={RoutesList.auth.logout} element={<h1>logout</h1>}/>
      </Routes>
    </div>
  );
}

export default App;
