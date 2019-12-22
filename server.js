const mongoose = require('mongoose');
const http = require('http');
const app = require('./index');
mongoose.connect('mongodb+srv://otibe:otibe@cluster0-wzvy5.mongodb.net/test?retryWrites=true&w=majority',{
        //  useMongoClient: true,
        useUnifiedTopology : true,
        useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;
const PORT =  process.env.PORT || 4001 ;
const server = http.createServer(app);

server.listen(PORT,()=> console.log("Port is On " + PORT));
