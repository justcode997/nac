const axios = require('axios');
const https = require('https');

const ERS_BASE_URL = process.env.ERS_BASE_URL;
const ERS_USER = process.env.ERS_USER;
const ERS_PASS = process.env.ERS_PASS;
const TIMEOUT = parseInt(process.env.ERS_TIMEOUT_MS || '10000', 10);
const REJECT_UNAUTHORIZED = process.env.ERS_REJECT_UNAUTHORIZED !== 'false'; // default true

const httpsAgent = new https.Agent({
  rejectUnauthorized: REJECT_UNAUTHORIZED
});

async function createEndpoint(payload) {
  if (!ERS_BASE_URL || !ERS_USER) {
    throw new Error('ERS configuration missing in environment');
  }

  const url = `${ERS_BASE_URL.replace(/\/$/, '')}/ers/config/endpoint`;

  try {
    const resp = await axios.post(url, payload, {
      httpsAgent,
      timeout: TIMEOUT,
      auth: { username: ERS_USER, password: ERS_PASS },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // return entire axios response so controller can decide what to do
    return resp;
  } catch (err) {
    // Normalize error thrown up to controller
    let message = err.message;
    let details = null;
    let statusCode = 500;

    if (err.response) {
      // Server returned a response (4xx/5xx)
      statusCode = err.response.status;
      details = err.response.data;
      message = `ERS returned ${statusCode}`;
    } else if (err.request) {
      // No response received
      message = 'No response from ERS';
    }

    const error = new Error(message);
    error.details = details;
    error.statusCode = statusCode;
    throw error;
  }
}

module.exports = {
  createEndpoint
};
