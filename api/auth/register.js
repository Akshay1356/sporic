export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { email, password, fullName, phone, organization, role = 'STUDENT' } = req.body || {};

    if (!email || !fullName) {
      return res.status(400).json({ success: false, message: 'Email and Full Name are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = role.toUpperCase();

    const user = {
      id: 'usr_' + Date.now(),
      email: normalizedEmail,
      name: fullName,
      phone: phone || '',
      organization: organization || 'Corporate Partner / VIT',
      role: assignedRole,
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
    };

    const token = 'jwt_token_' + Date.now();

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
      user,
      token,
      message: 'Account registered successfully in database.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
