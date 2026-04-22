// starts server
const app = require('./app'); // import the app

require('dotenv').config(); // load env

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});