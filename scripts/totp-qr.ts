import QRCode from "qrcode";

const AuthUrl = process.argv[2];

if (!AuthUrl) {
  throw new Error("Pass the OtpUrl as a argument ");
}

async function main() {
  await QRCode.toFile("totp.png", AuthUrl);
  console.log("Saved QRCode ");
}

main().catch((err) => {
  console.log("QR code fialed ", err);
  process.exit(1);
});
