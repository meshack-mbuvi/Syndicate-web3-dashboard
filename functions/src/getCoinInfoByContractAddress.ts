import { getCoinFromContractAddress } from "./utils/ethereum";

const handler = async (event, _) => {
  const contractAddress = event.queryStringParameters.contractAddress || "";
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  } else if (contractAddress === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 400,
        message: "Query parameter ?contractAddress is missing",
      }),
    };
  }

  let response;
  try {
    response = await getCoinFromContractAddress(contractAddress);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, message: "An error has occurred" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      code: 200,
      message: "Success",
      data: response,
    }),
  };
};

export { handler };
