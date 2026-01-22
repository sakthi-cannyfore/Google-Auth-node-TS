import { UserRegisterForm } from "./components/RegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import Home from "./components/Home";
import OAuthSuccess from "./components/OAuthSuccess";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/Hook";
import { setAccessToken } from "./redux/features/LoginSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(setAccessToken(token));
    }
  }, []);
  return (
    <div className="">
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <Routes>
          <Route path="register" element={<UserRegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/google-success" element={<OAuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
