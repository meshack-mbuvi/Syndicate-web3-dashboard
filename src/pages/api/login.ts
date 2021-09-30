import "@/utils/firebase/initAuth";

import { NextApiHandler } from "next";
import { setAuthCookies } from "next-firebase-auth";

const handler: NextApiHandler = async (req, res) => {
  await setAuthCookies(req, res).catch((error) => {
    console.error("Failed to set cookies", error);
  });
  return res.status(200).json({ success: true });
};

export default handler;
