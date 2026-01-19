import { UserRegisterForm } from "./components/RegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginUserForm from "./components/LoginUserForm";

const App = () => {
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
          <Route path="/register" element={<UserRegisterForm />} />
          <Route path="/login" element={<LoginUserForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
