const allowedCors = [
  'localhost:3000',
  'http://localhost:3000',
  "https://film-find.nomoredomains.work",
  "http://film-find.nomoredomains.work",
  "https://api.film-find.nomoredomains.work",
  "http://api.film-find.nomoredomains.work"
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    });
  }
  if (method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
      'Access-Control-Allow-Headers': requestHeaders,
    });
    res.end();
    return;
  }

  next();
};
