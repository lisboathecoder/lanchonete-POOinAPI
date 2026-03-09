import 'dotenv/config';

const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Chave de API inválida." });
  }
  next();
};

export default auth;
