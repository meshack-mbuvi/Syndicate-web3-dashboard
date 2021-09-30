import "@/utils/firebase/initAuth";

import { NextApiHandler } from "next";
import { unsetAuthCookies } from "next-firebase-auth";

const handler: NextApiHandler = async (req, res) => {
  await unsetAuthCookies(req, res).catch((error) => {
    console.error("Failed to unset cookies", error);
  });
  return res.status(200).json({ success: true });
};

export default handler;
