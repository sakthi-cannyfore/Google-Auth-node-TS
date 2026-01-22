import { useState } from "react";
import { useAppDispatch, useRootState } from "../redux/Hook";
import { forgetPassword } from "../redux/features/AuthThunk";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useRootState((s) => s.auth);

  const submitHandler = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      dispatch(forgetPassword({ email })).unwrap();
      toast.success("please check your mail");
      navigate("/resetpassword");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="h-screen ">
      <form
        onSubmit={submitHandler}
        className="h-full flex flex-col justify-center items-center"
      >
        <h2 className="text-green-600">
          Please enter the email address associated with your account to receive
          the password reset link
        </h2>
        <h1 className="text-3xl font-bold my-2">forget password </h1>

        <div className="flex justify-center items-center">
          <TextField
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              width: 400,
              "& .MuiInputBase-root": {
                height: 30,
              },
            }}
            className="mx-3"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{ width: 130, height: 30 }}
          >
            {loading ? "Sending..." : "Send Mail"}
          </Button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
