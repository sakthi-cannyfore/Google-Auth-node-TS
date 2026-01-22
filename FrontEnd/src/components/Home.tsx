import { Button } from "@mui/material";
import Logout from "../redux/features/LogoutSlice";
import { useAppDispatch } from "../redux/Hook";
import { useNavigate } from "react-router-dom";
import { SecuritySettings } from "./SecuritySettings";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const HandleLogout = () => {
    dispatch(Logout());
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <h1>Welcome To home Page </h1>

      <Button onClick={HandleLogout} variant="contained">
        Logout
      </Button>

      <SecuritySettings />
    </div>
  );
};

export default Home;
