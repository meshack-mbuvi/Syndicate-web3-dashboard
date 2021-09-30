import { init } from "next-firebase-auth";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error("Expected process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}

const databaseURL = `https://${projectId}.firebaseio.com`;

init({
  authPageURL: "/sign-in",
  appPageURL: "/syndicates",
  loginAPIEndpoint: "/api/login", // required
  logoutAPIEndpoint: "/api/logout", // required
  // firebaseAuthEmulatorHost: "localhost:9099",
  firebaseAdminInitConfig: {
    databaseURL,
    credential: {
      projectId,
      clientEmail: `firebase-adminsdk-jd8r4@${projectId}.iam.gserviceaccount.com`,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
        : undefined,
    },
  },
  firebaseClientInitConfig: {
    projectId,
    databaseURL,
    apiKey: "AIzaSyAxwMrDIB6zj35rnry2e6kzVpXsGM4YidU",
    appId: `1:635946706406:web:799d3e3dcfe73c6fb5e227`,
    authDomain: `${projectId}.firebaseapp.com`,
    messagingSenderId: "635946706406",
    storageBucket: `${projectId}.appspot.com`,
  },
  cookies: {
    name: "SocialAuthorization",
    keys: [
      process.env.COOKIE_SECRET_CURRENT,
      process.env.COOKIE_SECRET_PREVIOUS,
    ],
    httpOnly: true,
    overwrite: true,
    expires: null,
    path: "/",
    sameSite: "strict",
    secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true",
    signed: true,
  },
});
