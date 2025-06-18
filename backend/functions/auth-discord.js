exports.handler = async function (event, context) {
    const { userId } = event.queryStringParameters;
  
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }
  
    const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      process.env.DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify&state=${userId}`;
  
    return {
      statusCode: 302,
      headers: {
        Location: discordAuthURL,
      },
      body: JSON.stringify({ message: "Redirecting..." }),
    };
  };