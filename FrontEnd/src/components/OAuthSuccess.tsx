// OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/Hook";
import { toast } from "react-toastify";
import { fetchGoogleUser } from "../redux/features/AuthThunk";

const OAuthSuccess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchGoogleUser())
      .unwrap()
      .then(() => {
        toast.success("Logged in with Google ");
        navigate("/", { replace: true });
      })
      .catch(() => {
        toast.error("Google login failed");
        navigate("/login", { replace: true });
      });
  }, []);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
