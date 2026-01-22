import { Button, TextField, Typography } from "@mui/material";
import { useAppDispatch, useRootState } from "../redux/Hook";
import QRCode from "react-qr-code";
import { useState } from "react";
import { toast } from "react-toastify";
import { setupTwoFactor, verifyTwoFactor } from "../redux/features/AuthThunk";

export const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const { otpUrl, loading, twoFactorEnabled } = useRootState(
    (state) => state.auth
  );

  const [code, setCode] = useState("");

  const handleSetup = async () => {
    try {
      await dispatch(setupTwoFactor()).unwrap();
      toast.success("Scan the QR code with Google Authenticator");
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleVerify = async () => {
    try {
      await dispatch(verifyTwoFactor(code)).unwrap();
     
      toast.success("2-Step Verification Enabled");
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <div className=" h-screen flex justify-center items-center mx-auto ">

      {twoFactorEnabled ? (
        <Typography color="green"> 2-Step Verification Enabled</Typography>
      ) : (
        <>
          {!otpUrl && (
            <Button
              variant="contained"
              onClick={handleSetup}
              disabled={!!otpUrl || loading}
            >
              Enable 2-Step Verification
            </Button>
          )}

          {otpUrl && (
            <div className="border max-w-md flex flex-col justify-center items-center">
              <Typography mt={2}>Scan QR Code</Typography>
              <QRCode value={otpUrl} size={180} className=""/>

              <TextField
                label="Enter 6-digit code"
                fullWidth
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <Button variant="contained" onClick={handleVerify}>
                Verify & Enable
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
