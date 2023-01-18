const allowedOrigins: string[] = [
  "http://localhost:3000"
];

export const options = {
  origin: (origin: any, cb: any) => {

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    }

    cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}
