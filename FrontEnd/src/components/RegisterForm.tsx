import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useRootState } from "../redux/Hook";
import {
  Registerchema,
  type RegisterForm,
} from "./validaition/RegisterValidation";
import { useForm } from "react-hook-form";
import { RegisterAPi } from "../redux/features/AuthThunk";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserRegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useRootState((state) => state.auth);

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

  return (
    <div className="max-h-screen flex justify-center items-center ">
      <Paper elevation={3} className="w-75 p-6 my-10">
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
      </Paper>
    </div>
  );
};
