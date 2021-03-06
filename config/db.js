const mongoose = require('mongoose');

const connect = () => mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => { console.log(`Connected to 👉 ${result.connection.host}`.magenta.bold); })
    .catch(err => console.log(err));


module.exports = connect;