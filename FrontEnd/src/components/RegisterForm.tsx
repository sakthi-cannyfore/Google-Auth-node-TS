import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useRootState } from "../redux/Hook";
import { FcGoogle } from "react-icons/fc";

import {
  Registerchema,
  type RegisterForm,
} from "./validaition/RegisterValidation";
import { useForm } from "react-hook-form";
import { RegisterAPi } from "../redux/features/AuthThunk";
import { TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserRegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useRootState((state) => state.login);
  const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(Registerchema),
  });

  const onsubmit = (data: RegisterForm) => {
    console.log("before the dispatch");
    dispatch(RegisterAPi(data));
    toast.success("Please check your mail and login");
    navigate("/login");
    console.log("after the dispatch ");
  };

  const HandleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="max-h-screen flex  flex-col justify-center items-center ">
      <div className="w-100 p-6 my-10">
        <Typography variant="h6" className="mb-4 text-center">
          Register
        </Typography>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="my-10">
            <TextField
              {...register("name")}
              label="User Name"
              fullWidth
              error={!!errors.name}
              helperText={errors?.name?.message}
            />
          </div>

          <div className="my-10">
            <TextField
              {...register("email")}
              label="User Email "
              fullWidth
              error={!!errors.email}
              helperText={errors?.email?.message}
            />
          </div>

          <div className="my-10">
            <TextField
              {...register("password")}
              label="User Password"
              fullWidth
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message}
            />
          </div>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Registering" : "Submit"}
          </Button>
        </form>

        <Button
          variant="outlined"
          fullWidth
          className="py-2"
          onClick={HandleGoogleLogin}
        >
          <span className="flex justify-center items-center">
            <FcGoogle size={25} /> <p className="ml-2">login with google </p>
          </span>
        </Button>
      </div>
      <p>
        if you have an already account ? Please{" "}
        <span className="text-blue-500 underline">
          <a href="/login">Login</a>
        </span>{" "}
        here
      </p>
    </div>
  );
};
