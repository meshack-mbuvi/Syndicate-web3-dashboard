import { IClubInfo } from "@/state/legalInfo/types";

export const generateMemberSignURL = (
  clubAddress: string,
  clubInfo: IClubInfo,
  adminSignature: string,
): string => {
  const formData = new URLSearchParams({
    form: btoa(JSON.stringify({ ...clubInfo, adminSignature })),
  }).toString();

  return encodeURI(
    `${window.location.origin}/clubs/${clubAddress}/member/invite?${formData}`,
  );
};
