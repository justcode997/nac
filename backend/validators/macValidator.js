function isValidMac(mac) {
  // Accepts formats: AA:BB:CC:DD:EE:FF or AABBCCDDEEFF (case-insensitive) or AA-BB-CC-DD-EE-FF
  return /^[0-9A-Fa-f]{12}$/.test(mac.replace(/[:-]/g, ''));
}

exports.validateMac = (req, res, next) => {
  const { mac, name, description, groupId, staticGroupAssignment } = req.body;

  if (!mac || !isValidMac(mac)) {
    return res.status(400).json({ error: 'Invalid or missing mac. Use format AA:BB:CC:DD:EE:FF' });
  }

  // Optional fields minimal checks
  if (groupId && typeof groupId !== 'string') {
    return res.status(400).json({ error: 'groupId must be a string' });
  }

  // convert MAC to canonical form (no separators, uppercase) — ERS accepts many forms but we'll send normalized
  req.body.mac = mac.replace(/[:-]/g, '').toUpperCase();

  // default staticGroupAssignment if not provided
  if (typeof staticGroupAssignment === 'undefined') {
    req.body.staticGroupAssignment = true;
  } else {
    req.body.staticGroupAssignment = !!staticGroupAssignment;
  }

  next();
};