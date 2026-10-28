// starts server
require('dotenv').config(); // load env
const app = require('./app'); // import the app


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});
