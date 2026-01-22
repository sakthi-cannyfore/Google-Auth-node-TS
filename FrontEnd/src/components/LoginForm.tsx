import { Fetchlogin } from "../redux/features/LoginSlice";
import { useAppDispatch, useRootState } from "../redux/Hook";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import type { LoginFormValidation } from "./validaition/LoginValidation";
import { loginSchema } from "./validaition/LoginValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken, twoFactorEnabled} = useRootState(
    (state) => state.auth
  );

  console.log("twoFactorEnabled", twoFactorEnabled);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValidation>({
    resolver: zodResolver(loginSchema),
  });

  const onsubmit = async (data: LoginFormValidation) => {
    try {
      await dispatch(Fetchlogin(data)).unwrap();
      navigate("/", { replace: true });
      toast.success("Logged in successfully ");
    } catch (error: any) {
      toast.error(error);
    }
  };
  return (
    <div className=" max-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(onsubmit)} className="w-100">
        <Typography variant="h2" className="text-center">
          Login
        </Typography>
        <Box
          maxWidth={400}
          mx="auto"
          mt={10}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            {...register("email")}
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
          <TextField
            {...register("password")}
            label="Password"
            fullWidth
            error={!!errors.password}
            helperText={errors?.password?.message}
          />

          {twoFactorEnabled && (
            <TextField
              {...register("twoFactorCode")}
              label="Access Code"
              fullWidth
              error={!!errors.twoFactorCode}
              helperText={errors?.twoFactorCode?.message}
            />
          )}

          <Button variant="contained" disabled={loading} type="submit">
            {loading ? <CircularProgress size={24} /> : " Login "}
          </Button>
        </Box>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </form>
      <p>
        If You are new to here please{" "}
        <span className="text-blue-500 underline">
          <a href="/register">Signup</a>
        </span>
      </p>
    </div>
  );
};
