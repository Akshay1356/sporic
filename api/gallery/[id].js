// Serverless API for single gallery item operations (PUT / DELETE)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    return res.status(200).json({
      success: true,
      message: 'Photo updated successfully.',
      data: { id, ...body, updatedAt: new Date().toISOString() },
    });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully.',
      id,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
