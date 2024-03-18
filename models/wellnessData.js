const mongoose = require('mongoose');

const wellnessDataSchema = new mongoose.Schema({
    wellnesstype: String,
    image: Buffer, // or any other appropriate type for images
    title: String,
    maintitle: String,
    content: [{
      heading: String,
      paragraph: String,
      facts: String
    }]
  });
  
  const WellnessDataTable = mongoose.model('WellnessDataTable', wellnessDataSchema);

module.exports = WellnessDataTable;




// const mongoose = require('mongoose');
// const WellnessDataSchema = new mongoose.Schema({
//     wellnesstype: String ,
//      image : String, 
//      title : String,
// });
// const WellnessDataTable = mongoose.model('WellnessData',WellnessDataSchema);
// module.exports = WellnessDataTable;


