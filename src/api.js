const apiUrl = process.env.REACT_APP_API_URL;

export const sendRequest = async ({path, data, method = 'GET'}) => {
  try {
    const options = {
      headers: {'Content-Type': 'application/json'},
      method,
    };

    if (data && typeof data === 'string') {
      options.body = data;
    } else if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${apiUrl}/${path}`, options);
    const responseData = JSON.parse(await response.text());

    if (!response.ok) {
      return {error: responseData.message || 'an unknown error occurred'};
    }

    return responseData;
  } catch (error) {
    return {error: error.message || 'an unknown error occurred'};
  }
};
