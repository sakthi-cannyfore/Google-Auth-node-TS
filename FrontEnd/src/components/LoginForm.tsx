import { Fetchlogin } from "../redux/features/LoginSlice";
import { useAppDispatch, useRootState } from "../redux/Hook";
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
export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error, accessToken } = useRootState((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValidation>({
    resolver: zodResolver(loginSchema),
  });

  const onsubmit = (data: LoginFormValidation) => {
    dispatch(Fetchlogin(data));
    if (accessToken != undefined) {
      const token = localStorage.setItem("accesstoken", accessToken);
      console.log("Token", token);
    }
  };
  return (
    <div>
      <Typography variant="h2">LoginForm</Typography>
      <form onSubmit={handleSubmit(onsubmit)}>
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

          {/* {accessToken && (
            <TextField
              {...register("accessToken")}
              label="Access Code"
              fullWidth
              error={!!errors.accessToken}
              helperText={errors?.accessToken?.message}
            />
          )} */}

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
    </div>
  );
};
