const ersService = require('../services/ersService');

exports.createMac = async (req, res) => {
  try {
    const { groupId, description, staticGroupAssignment, mac, name } = req.body;

    // Map to ERS payload shape
    const ersPayload = {
      ERSEndPoint: {
        groupId: groupId || '',
        description: description || '',
        staticGroupAssignment: !!staticGroupAssignment,
        mac, // normalized by validator
        name: name || `endpoint-${mac}`
      }
    };

    const ersResponse = await ersService.createEndpoint(ersPayload);

    // Optionally, persist to DB here later (ersResponse + request info)

    return res.status(201).json({
      status: 'success',
      message: 'MAC added to ERS',
      ers: ersResponse.data ?? ersResponse
    });
  } catch (err) {
    // ersService throws with informative error
    const status = err.statusCode || 500;
    return res.status(status).json({
      status: 'error',
      message: err.message || 'Failed to add MAC',
      details: err.details || null
    });
  }
};