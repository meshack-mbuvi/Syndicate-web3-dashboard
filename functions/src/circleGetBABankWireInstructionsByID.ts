import circleAxios from "./utils/axios";

const handler = async (event, _) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  } else if (!event.queryStringParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 400,
        message: "?id query parameter is required",
      }),
    };
  }
  const url = `/v1/businessAccount/banks/wires/${event.queryStringParameters.id}/instructions`;
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