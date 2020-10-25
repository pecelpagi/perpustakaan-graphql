const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const schema = require('./schema/schema');

const app = express();

mongoose.connect('mongodb+srv://galuh:sJdA6FKofLFKKkCD@cluster0.msyqd.mongodb.net/simple_perpus?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(3301, () => {
    console.log('listening on port 3301');
});