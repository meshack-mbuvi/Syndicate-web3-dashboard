import { IClubInfo } from "@/state/legalInfo/types";
import { encode } from "js-base64";

export const generateMemberSignURL = (
  clubAddress: string,
  clubInfo: IClubInfo,
  adminSignature: string,
): string => {
  const formData = new URLSearchParams({
    form: encode(JSON.stringify({ ...clubInfo, adminSignature })),
  }).toString();

  return encodeURI(
    `${window.location.origin}/clubs/${clubAddress}/member/invite?${formData}`,
  );
};
