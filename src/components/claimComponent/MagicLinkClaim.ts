import axios from "axios";

export class MagicLinkClaimHandler {
  static async get(uuid: string): Promise<number> {
    try {
      const { status } = await axios.get(
        `${process.env.NEXT_PUBLIC_MAGIC_LINK_API}?uuid=${uuid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      localStorage.setItem("claim-uuid", uuid.toString());

      return status;
    } catch (error) {
      localStorage.removeItem("claim-uuid");

      const {
        response: { status },
      } = error;
      return status;
    }
  }

  static async patch(uuid: string): Promise<number> {
    try {
      const { status } = await axios.patch(
        `${process.env.NEXT_PUBLIC_MAGIC_LINK_API}?uuid=${uuid}`,
        {
          uuid,
        },
      );
      localStorage.removeItem("claim-uuid");

      return status;
    } catch (error) {
      localStorage.removeItem("claim-uuid");

      const {
        response: { status },
      } = error;
      return status;
    }
  }
}
