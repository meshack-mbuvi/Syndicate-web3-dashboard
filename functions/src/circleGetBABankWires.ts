import circleAxios from "./utils/axios";

const handler = async (event, _) => {
  const accountID = event.queryStringParameters.id || "";
  const url = `/v1/businessAccount/banks/wires/${accountID}`;
  // Add Authorization 'Bearer <API_KEY>' as a header
  const { authorization } = event.headers;
  let response;
  const headers = { Authorization: authorization };
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ code: 405, message: "Method Not Allowed" }),
    };
  } else if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ code: 401 , message: "API Key missing from header"}),
    };
  }

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
