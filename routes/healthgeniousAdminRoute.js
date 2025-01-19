const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AddHealthconstionTable = require('../models/healthmain/healthCondition.js');
const AddHealthNameTable = require('../models/healthmain/healthName.js');
const healthConditionTable = require('../models/healthmain/healthCondition.js');
const healthNameTable = require('../models/healthmain/healthName.js');
const HealthTypeTable = require('../models/healthmain/healthType.js');
const AddHealthTable = require('../models/AddHealth.js');
const NewsTable = require('../models/NewsModel.js');
const add_News_Table = require('../models/NewsModel.js');
const searchdConditionsTable = require('../models/searchedConditions.js');
const User_Feedback_Table = require('../models/feedback.js');
const getHealthModel = require('../models/dynamic_healthcondition_add.js');
const HealthModel = require('../models/AddHealth.js'); // Import existing Health model
const AllHealthTable = require('../models/AddHealth.js');
const Add_Health_Group_Data_collection = require('../models/Add_Health_Group_Data_collection.js');


const multer = require('multer');
const { ObjectId } = require('mongodb');

router.get('/',async (req,res) => {
    res.status(200).send({message:'HealthGenious server is running'});
});

router.post('/addhealthcodition',async (req,res)=> {
    try {
        const {healthCondition,healthCondition_description} =req.body;
        // console.log(req.body);
        const doc = await AddHealthconstionTable({
            healthCondition:healthCondition,
            healthCondition_description:healthCondition_description
        })
        await doc.save();
        const savedCondition = await AddHealthconstionTable.find();
        res.status(200).send({message : 'saved successfully' ,savedCondition});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})

router.post('/addhealthname',async (req,res)=> {
    try {
        const {healthname, health_name_description} =req.body;
        const doc = await AddHealthNameTable({
            healthname:healthname,
            health_name_description:health_name_description
        })
        await doc.save();
        const savedHealthName = await AddHealthNameTable.find();
        res.status(200).send({message : 'saved successfully' ,savedHealthName});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})

router.post('/addhealthtype',async (req,res)=> {
    try {
        const {healthtype, health_type_description} =req.body;
        const doc = await HealthTypeTable({
            healthtype:healthtype,
            health_type_description:health_type_description
        })
        await doc.save();
        const savedHealthType = await HealthTypeTable.find();
        res.status(200).send({message : 'saved successfully' ,savedHealthType});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})

router.get('/allhealthcodition',async (req,res)=> {
    try {
        const allhealthCondition = await healthConditionTable.find();
        res.status(200).send({message : 'fetched successfully' ,allhealthCondition});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})

router.get('/allhealthname',async (req,res)=> {
    try {
        const allhealthName = await healthNameTable.find();
        res.status(200).send({message : 'fetched successfully' ,allhealthName});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})

router.get('/allhealthtype',async (req,res)=> {
    try {
        const AllHealthType = await HealthTypeTable.find();
        res.status(200).send({message : 'fetched successfully' ,AllHealthType});

    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// add health

const storage = multer.memoryStorage();
const upload = multer({storage : storage})

// API to Add Health Data
router.post('/addHealth', upload.single('image'), async (req, res) => {
    const {
        health_type,
        health_type_description,
        health_condition,
        healthCondition_description,
        health_name,
        health_name_description,
        title,
        reviewed_by,
        content
    } = req.body;

    try {
        // Handle Image Upload
        let image;
        if (req.file) {
            image = req.file.buffer;
        } else if (req.body.image) {
            image = Buffer.from(req.body.image, 'base64');
        } else {
            return res.status(400).send({ message: 'Image is required' });
        }

        // Map Content
        let mappedContent = [];
        if (Array.isArray(content)) {
            mappedContent = content.map(c => ({
                main_title: c.main_title,
                topic_heading: c.topic_heading,
                topic_title: c.topic_title,
                topic_description: c.topic_description,
                topic_paragraph: c.topic_paragraph,
                topic_facts: c.topic_facts,
            }));
        } else {
            mappedContent = [{
                main_title: content.main_title,
                topic_heading: content.topic_heading,
                topic_title: content.topic_title,
                topic_description: content.topic_description,
                topic_paragraph: content.topic_paragraph,
                topic_facts: content.topic_facts,
            }];
        }

         // Dynamically create a sanitized collection name
         const collectionName = `health_data_${health_condition.replace(/\s+/g, '_')}`; // Replace spaces only

        const HealthModel = getHealthModel(collectionName);

        const healthData = new HealthModel({
            health_type,
            health_type_description,
            health_condition,
            healthCondition_description,
            health_name,
            health_name_description,
            title,
            image,
            reviewed_by,
            content: mappedContent
        });

        // Save to dynamically created collection
        await healthData.save();

        res.status(200).send({ status: true, message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// fetchHealthGroupData

router.get('/fetchHealthGroupData', async (req, res) => {
    try {
        const HealthGroupData = await Add_Health_Group_Data_collection.find();
        res.status(200).send({ status: true,HealthGroupData});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
});

// addHealthGroupData

router.post('/addHealthGroupData', async (req, res) => { 
    try {
        const { health_type, health_type_description, health_condition, healthCondition_description, health_name, health_name_description } = req.body.addHealthGroupData;
        const Add_Health_Group_Data = await Add_Health_Group_Data_collection({
            health_type: health_type,
            health_type_description: health_type_description,
            health_condition: health_condition,
            healthCondition_description: healthCondition_description,
            health_name: health_name,
            health_name_description: health_name_description,
        })
        await Add_Health_Group_Data.save();
        const Saved_Health_Group_Data = await Add_Health_Group_Data_collection.find();
        res.status(200).send({ message: 'Data saved successfully!',Saved_Health_Group_Data});
    } catch (error) {
        res.status(500).send({ status:false, message : 'Internal Server Error'});
    }
});




// const healthRelatedCollections = [
//     'fitness_and_exercise',
//     'nutrition_and_diet'
//   ];
  
  // Route to fetch data from specific collections




//   FOR TESTING PURPOSE ROUTE ONLY
  router.get('/TestingAllHealth', async (req, res) => {

    // try {
    //     // const TestingHealthData = await AllHealthTable.find({}, { health_type : 1, health_condition : 1});
    //     const TestingHealthData = await AllHealthTable.find();
    //     res.status(200).send({message : 'fetched success', TestingHealthData})
    // } catch (error) {
    //     res.status(500).send({message : 'internal server error'});
    // }


    
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
       // Filter collections with the prefix 'health_data_'
        const healthCollections = collections
        .filter(col => col.name.startsWith('health_data_')) // Match prefix
        .map(col => col.name); // Extract collection names

        let allHealthData = [];
        for (let collectionName of healthCollections) {
        const Model = getHealthModel(collectionName); // Dynamic model
        const data = await Model.find(); // Fetch data
        allHealthData.push({ collectionName, data }); // Append data
        }

        res.status(200).send({ status: true, data: allHealthData });
      
    } catch (error) {
      console.error('Error fetching health data:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }


    // try {
    //     const collections = await mongoose.connection.db.listCollections().toArray() //list all array
    //     for (let collection of collections) {
    //         const count = await mongoose.connection.db.collection(collection.name).countDocuments();
    //         if(count === 0) {
    //             await mongoose.connection.db.dropCollection(collection.name);
    //             console.log(`Dropped collection : ${collection.name}`);
    //         }
    //     }
    //     console.log('All empty collections dropped s');
    // } catch (error) {
        
    // }
  });


  
//   async function backendFunction() {

    // try {
    //     const health_condition_name = "Home_Workouts";

    //     const health_condition_Data = await AddHealthTable.find({ health_condition:health_condition_name});
    //     if (health_condition_Data.length === 0) {
    //         console.log(`No data found with health_condition: ${health_condition_name}`);
    //         return;
    //     }
    //     console.log(`Fetched ${health_condition_Data.length} documents.`);
    //     const CoreHealthModel = mongoose.model(`health_condition_${health_condition_name}`, HealthModel.schema, `health_data_${health_condition_name}`);
    //     await CoreHealthModel.insertMany(health_condition_Data);
    //     console.log(`Inserted ${health_condition_Data.length} documents into health_data_${health_condition_name}  collection.`);
    // } catch (error) {
    //     console.error('Error copying data:', error);
    // } finally {
    //     mongoose.connection.close(); // Close the connection
    // }




    //  for fetching results

    // try {
    //     const health_condtions = await healthConditionTable.find(); 
    //     const descriptions = health_condtions.map(item => item.healthCondition);
    //     console.log(descriptions);        
    // } catch (error) {
        
    // }
// }

// backendFunction();



// async function getCollectionSize() {
//     try {
//         const db = mongoose.connection.db; // Access the native database
//         const collection = db.collection('health_type_core_health'); // Specify your collection name
//         const stats = await collection.stats(); // Get collection stats

//         console.log(`Collection Size: ${stats.size} bytes`); // Size in bytes
//         console.log(`Number of Documents: ${stats.count}`); // Number of documents in the collection
//     } catch (error) {
//         console.error('Error fetching collection stats:', error);
//     } finally {
//         mongoose.connection.close(); // Close the connection
//     }
// }

// getCollectionSize();






// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// ADD HEALTH DATA

// const storage = multer.memoryStorage();
// const upload = multer({storage : storage})
// router.post('/addHealth',upload.single('image'), async(req,res) => {
//     const { health_type,health_type_description,health_condition,healthCondition_description,health_name,health_name_description,title,reviewed_by,content} = req.body;
//     // console.log('body data', req.body);
//     try {
//         let image;
//         if (req.file) {
//             image = req.file.buffer;
//         } else if (req.body.image) { image = Buffer.from(req.body.image, 'base64');
//         } else {  return res.status(400).send({ message: 'Image is required' }); }
//         let mappedContent = [];
//         if (Array.isArray(content)) {
//             // If content is an array, map over it
//             mappedContent = content.map(c => ({
//                 main_title: c.main_title,
//                 topic_heading: c.topic_heading,
//                 topic_title: c.topic_title,
//                 topic_description: c.topic_description,
//                 topic_paragraph: c.topic_paragraph,
//                 topic_facts: c.topic_facts,
//             }));
//         } else {
//             // If content is not an array, handle it accordingly (e.g., convert it to an array)
//             mappedContent = [{
//                 main_title: content.main_title,
//                 topic_heading: content.topic_heading,
//                 topic_title: content.topic_title,
//                 topic_description: content.topic_description,
//                 topic_paragraph: content.topic_paragraph,
//                 topic_facts: content.topic_facts,
//             }];
//         }
//         const health_data = new AddHealthTable({
//             health_type:health_type,
//             health_type_description:health_type_description,
//             health_condition:health_condition,
//             healthCondition_description:healthCondition_description,
//             health_name:health_name,
//             health_name_description:health_name_description,
//             title: title,
//             image:image,
//             reviewed_by: reviewed_by,
//             content: mappedContent
//         });
//         await health_data.save();
//         const savedHealthData = await AddHealthTable.find({ title: title });
//         // console.log('savedHealthData', savedHealthData);
//         res.status(200).send({ status: true, message: 'Data saved successfully', savedHealthData });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// })

// GET ALL HEALTH DATA

router.get('/getHealth',async(req,res) => {
    try {
        const healthData = await AddHealthTable.find();
        res.status(200).send({message : 'fetched success', healthData})
    } catch (error) {
        res.status(500).send({message : 'internal server error'});
    }
})

  // delete Health
  router.delete('/deleteHealth', async (req, res) => {
    try {
      const { _id } = req.body;  
      if (!_id) {
        console.error('Invalid _id parameter');
        return res.status(400).send({ message: 'Invalid _id parameter' });
      }
      const objectId = new ObjectId(_id);
      const deletedDoc = await AddHealthTable.findOneAndDelete({ _id: objectId });
        res.status(200).send({ message: 'Deleted successfully', deletedDoc: deletedDoc });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });



//   news

router.post('/addnews',async (req,res) => {  
    try {
        const {sourceName, author, title, description, url, urlToImage, publishedAt, content}  = req.body;
        // console.log('body_Data',req.body);
        let mappedContent = [];
        // if content is array, map it over
        if(Array.isArray(content)){
        mappedContent = content.map(c => ({
            news_topic_heading: c.news_topic_heading,
            news_topic_title : c.news_topic_title,
            news_topic_description: c.news_topic_description
        }))
    } else { 
        // if content is not an array, handle it accordingly (e.g., convert it to an array)
        mappedContent =[{
            news_topic_heading : content.news_topic_heading,
            news_topic_title : content.news_topic_title,
            news_topic_description : content.news_topic_description
        }]
    }
      
        const news_Data = new add_News_Table({
            sourceName:sourceName,
            author:author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: mappedContent,
        })
        await news_Data.save();
        res.status(200).send({message: 'success'});
    } catch (error) {
        res.status(409).send('Internal Server Error',error);
    }
} );


router.delete('/DeleteNews',async(req,res) => {
    try {
        const {_id} = req.body;
        const DeleteNews = await NewsTable.deleteOne({_id : _id});
        res.status(200).send({message:'deleted successfully',DeleteNews})
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'})
    }
})


router.get('/fetchAllNews',async (req,res) => {
    try {
        const All_News = await NewsTable.find();
        const News = All_News.reverse();
        res.status(200).send({message:'fetch success', status:true, News})
    } catch (error) {
        res.status(409).send({message:'Internal Server Error'});
    }
})


router.get('/adminHealthgenious', async (req,res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const healthCollections = collections
            .map(col => col.name)
            .filter(name => name.startsWith('health_data_'));
        if (healthCollections.length === 0) {
            return res.status(404).send({ message: 'No health_data collections found' });
        }
        // Fetch all documents from each collection
        const dataPromises = healthCollections.map(async (collectionName) => {
            const HealthModel = getHealthModel(collectionName);
            return HealthModel.find({}); // Fetch all documents as plain objects
        });
        const results = await Promise.all(dataPromises);
        // Combine results into a single array
        const allData = results.flat(); // Flatten the array of arrays
        if (allData.length === 0) {
            return res.status(404).send({ message: 'No data found in the collections', content: [] });
        }
        res.status(200).send({ message: 'Data retrieved successfully', content: allData });
    } catch (error) {
        res.status(404).send({message:'Internal Server Error'});
    }
})









router.get('/fetchSearchedConditions', async (req ,res) => {
    try {
        const Searched_Conditions = (await searchdConditionsTable.find()).reverse();
        res.status(200).send({ 
            message: 'Fetched Success', 
            data: Searched_Conditions 
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

router.get('/fetchUserFeedback',async (req,res) => {
    try {
        const User_Feedback = (await User_Feedback_Table.find()).reverse();
        res.status(200).send({message :'fetch success',data:User_Feedback});
    } catch (error) {
        res.status(500).send({message : 'Internal Server Error'});
    }
})




module.exports = router;
