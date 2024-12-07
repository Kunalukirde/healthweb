const mongoose = require('mongoose');

// dbName = 'healthgenious';
// DbName = 'nodeauth';

const mongoDBconnect = async (DATABASE_URL,DB_Name) => {
    try {
        await mongoose.connect(DATABASE_URL + DB_Name);
        console.log('Mongo DB Connected...');
    } catch (error) {
        console.log('Error Connecting to Mongo DB : ', error);
    }
}






// DbName = 'nodeauth';
// const mongoDBconnect = async (DATABASE_URL, DbName) => {  
//     try {
//         await mongoose.connect(DATABASE_URL,DbName); 
//         console.log('Mongo DB Connected...');   
//     } catch (error) {
//         console.log('Error connecting to MongoDB ... ' , error);
//     }
// }
module.exports = mongoDBconnect;