export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body || {};
  const OWNER_PASSWORD = process.env.OWNER_PASSWORD || '21062006';

  if (password && password.trim() === OWNER_PASSWORD.trim()) {
    return res.status(200).json({
      success: true,
      token: 'ri_ver_' + Date.now(),
      message: 'Authenticated successfully'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect demo password. Please try again.'
  });
}
