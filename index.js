const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const mongoDBconnect = require('./dbconnect/dbconnection.js');

const DATABASE_URL = process.env.DATABASE_URL;
const DB_Name = process.env.db_Name;
mongoDBconnect(DATABASE_URL,DB_Name);
app.use(express.json());
app.use(express.urlencoded({extended : true}));


const healthgeniousRoute = require('./routes/healthgenious.js');
const newsRoute = require('./routes/newsRoute.js');
const feedBackRoute = require('./routes/feedbackRoute.js');
const Wellness = require('./routes/wellnessData.js');
const routes = require('./routes/routes.js');
const healthgeniousadminAuth = require('./routes/AdminAuth.js');
const AdminRoute = require('./routes/AdminRoute.js');
const healthgenious_AdminRoute = require('./routes/healthgeniousAdminRoute.js');
const auth = require('./middleware/AdminAuth.js');

app.use('/healthgenious',healthgeniousRoute);
app.use('/healthgenious/feedback',feedBackRoute);
app.use('/wellness' , Wellness);
app.use('/healthgeniousadminAuth', healthgeniousadminAuth);
app.use('/admin', AdminRoute);
app.use('/news', newsRoute);
app.use('/healthgeniousAdmin',auth,healthgenious_AdminRoute);

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
