// starts server
const app = require('./app'); // import the app

const PORT = 5000;

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});