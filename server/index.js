// index.js
const app = require('./server'); // ✅ imports Express app from server.js

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});