const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const mongoDBconnect = require('./dbconnect/dbconnection.js');
const DATABASE_URL = process.env.DATABASE_URL;
mongoDBconnect(DATABASE_URL);
app.use(express.json());
app.use(express.urlencoded({extended : true}));


const routes = require('./routes/routes.js');
const AdminRoute = require('./routes/AdminRoute.js');
const Wellness = require('./routes/wellnessData.js');
const healthyAdminRoute = require('./routes/healthyAdminRoute.js');
const healthyRoute = require('./routes/healthy.js');
const newsRoute = require('./routes/newsRoute.js');
const feedBackRoute = require('./routes/feedbackRoute.js');


app.use('/admin', AdminRoute);
app.use('/wellness' , Wellness);
app.use('/healthyAdmin',healthyAdminRoute);
app.use('/healthy',healthyRoute);
app.use('/news', newsRoute);
app.use('/feedback',feedBackRoute);

app.use(express.static(path.join(__dirname, 'healthy')));
app.use('/adminpanel',express.static(path.join(__dirname,'admin/browser')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'healthy/index.html'));
});
app.get('/adminpanel/*',(req,res) => {
    res.sendFile(path.join(__dirname, 'admin/browser/index.html'));
})
const PORT = process.env.PORT;
app.listen(PORT, ()=> {console.log(`Listeing on http://localhost:${PORT}`)});

// app.listen(()=> { console.log('Server Started')});