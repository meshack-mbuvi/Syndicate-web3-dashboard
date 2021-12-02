import { getCoinPrices } from "./utils/ethereum";

const handler = async (event, _) => {  
  const contractAddresses = event.queryStringParameters.contractAddresses || "";
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  } else if (contractAddresses === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 400,
        message: "Query parameter ?contractAddresses is missing",
      }),
    };
  }

  try {
    const response = await getCoinPrices(contractAddresses.split(','));
    return {
      statusCode: 200,
      body: JSON.stringify({
        code: 200,
        message: "Success",
        data: response,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, message: "An error has occurred" }),
    };
  }
};

export { handler };
