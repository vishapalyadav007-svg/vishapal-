exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { password } = JSON.parse(event.body || "{}");
    const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "21062006";

    if (password && password.trim() === OWNER_PASSWORD.trim()) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          token: "ri_net_" + Date.now(),
          message: "Authenticated successfully"
        })
      };
    }

    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Incorrect demo password. Please try again."
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
