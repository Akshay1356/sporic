export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const email = req.query?.email || req.body?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Default response (actual uniqueness checked by persistence store)
    return res.status(200).json({
      success: true,
      exists: false,
      email: normalizedEmail,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
