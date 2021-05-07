import { verifyMessageSignature } from "./utils/ethereum";

const handler = async (event, _) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  }
  const body = JSON.parse(event.body);
  let response;
  try {
    response = await verifyMessageSignature(body);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Uknown Error"),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      code: 200,
      message: "Success",
      data: { ...response },
    }),
  };
};

export { handler };
