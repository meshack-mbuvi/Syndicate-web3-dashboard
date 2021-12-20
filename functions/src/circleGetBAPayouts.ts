import circleAxios from "./utils/axios";

const handler = async (event, _) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  }
  const payoutID = event.queryStringParameters.id || "";
  const url = `/v1/businessAccount/payouts/${payoutID}`;
  // Add Authorization 'Bearer <API_KEY>' as a header
  const { authorization } = event.headers;
  let response;
  const headers = { Authorization: authorization };
  try {
    response = await circleAxios.get(url, { headers });
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify(error.response.data),
    };
  }
  return {
    statusCode: response.status,
    body: JSON.stringify({
      code: response.status,
      message: "Success",
      data: response.data.data,
    }),
  };
};

export { handler };
