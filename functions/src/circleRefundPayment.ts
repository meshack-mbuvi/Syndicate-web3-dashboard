import circleAxios from "./utils/axios";
import uuid from "./utils/uuid";

const handler = async (event, _) => {
  const expectedReasons = ["duplicate", "fraudulent", "requested_by_customer"];
  const body = JSON.parse(event.body);
  if (event.httpMethod !== "POST") {
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
  } else if (!expectedReasons.includes(body.reason)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 400,
        message: `${body.reason} is not an acceptable reason. Allowed reasons, [${expectedReasons}]`,
      }),
    };
  }

  const paymentID = event.queryStringParameters.id || "";
  const url = `/v1/payments/${paymentID}/refund`;
  // Add Authorization 'Bearer <API_KEY>' as a header
  const { authorization } = event.headers;
  let response;
  const headers = { Authorization: authorization };
  try {
    let data = body.idempotencyKey ? body : { ...body, idempotencyKey: uuid() };
    response = await circleAxios.post(url, data, { headers });
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
