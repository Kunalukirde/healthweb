const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 80;
// console.log(process.env); // This will display all environment variables
const mongoDBconnect = require('./dbconnect/dbconnection.js');
const DATABASE_URL = process.env.DATABASE_URL;
const DB_Name = process.env.db_Name;
mongoDBconnect(DATABASE_URL,DB_Name);
app.use(express.json());
app.use(express.urlencoded({extended : true}));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use('/adminpanel',express.static(path.join(__dirname,'admin/browser')));
    // FOR MAINTENANCE CODE
    const isMaintenance = process.env.MAINTENANCE === 'true';
    if (isMaintenance) {
        console.log("Maintenance mode is ON.");
        app.use(express.static(path.join(__dirname, 'public')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'maintenance.html'));
        });
    } else {
        console.log("Maintenance mode is OFF.");
        app.use(express.static(path.join(__dirname, 'healthy')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'healthy', 'index.html'));
        });
    }
        app.get('/adminpanel/*', (req, res) => {
            res.sendFile(path.join(__dirname, 'admin/browser/index.html'));
        });


// // ENTRY CODE
// app.use(express.static(path.join(__dirname,'healthy')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'healthy/index.html'));
// });

// app.get('/adminpanel/*',(req,res) => {
//     res.sendFile(path.join(__dirname, 'admin/browser/index.html'));
// })

// app.listen(PORT, ()=> {console.log(`Listeing on http://localhost:${PORT}`)});
app.listen(PORT, () => {console.log(`Server is live on port ${PORT}`);});