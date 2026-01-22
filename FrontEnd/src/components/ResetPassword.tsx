import { useState } from "react";
import { resetPassword } from "../redux/features/AuthThunk";
import { useAppDispatch, useRootState } from "../redux/Hook";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useRootState((s) => s.auth);

  const submitHandler = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!token) return alert("Invalid reset link");
      dispatch(resetPassword({ token, password })).unwrap();
      navigate("/login");
    } catch (error: any) {
      toast.error(error||"Please enter valid code 🛑");
    }
  };

  return (
    <div className="h-screen">
      <form
        onSubmit={submitHandler}
        className="h-full flex flex-col justify-center items-center"
      >
        <h2 className="text-green-600">
          Please enter a valid code and reset your password.
        </h2>

        <div className="flex justify-center items-center">
          <TextField
            type="password"
            label="Enter new Password"
            placeholder="New Password"
            value={password}
            sx={{
              width: 400,
              "& .MuiInputBase-root": {
                height: 50,
              },
            }}
            className="mx-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            type="token"
            label="Token"
            placeholder="Enter a Token "
            value={token}
            sx={{
              width: 400,
              "& .MuiInputBase-root": {
                height: 50,
              },
            }}
            className="mx-3"
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{ width: 200, height: 50, marginTop: 5 }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
