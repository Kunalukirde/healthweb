const redis = require('redis');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const searched_conditionsTable = require('../models/searchedConditions.js');
const healthgenious_DataTable = require('../models/AddHealth.js');
const healthConditionTable = require('../models/healthmain/healthCondition.js');
const getHealthModelTable = require('../models/dynamic_healthcondition_add.js');
const getHealthModel = require('../models/dynamic_healthcondition_add.js');
const health_group_collection = require('../models/Add_Health_Group_Data_collection.js');


router.get('/',async(req,res) => {
    try {
        res.status(200).send({message: 'HealthGenious Website is live'})
    } catch (error) {
        res.status(500).send({message : "Internal Server Error"});
    }
})
router.get('/healthgeniousData',async(req,res)=>{
    try {
        // const All_healthgenious_data = await healthgenious_DataTable.find().sort({_id : -1});
        const healthgeniousData = await healthgenious_DataTable.find();
        // const healthgeniousData = All_healthgenious_data.reverse();
        res.status(200).send({status: true, message : 'fetch success', healthgeniousData});
    } catch (error) {
        res.status(500).send({status:false, message : 'internal server error'});
    }
})

router.get('/exploreConditions', async (req, res) => {
    try {
            const specifiedCollections = [
                'health_data_Exercise',
                'health_data_Hydration',
                'health_data_Stress_Management'
            ];
            const dataPromises = specifiedCollections.map(async (collectionName) => {
                try {
                    const HealthModel = getHealthModel(collectionName); // Get dynamic model for the collection
                    const data = await HealthModel.findOne({}); // Fetch one document
                    return data;
                } catch (error) {
                    return null;
                }
            });
            const exploreConditionsData = await Promise.all(dataPromises);
            const exploreConditions = exploreConditionsData.filter(condition => condition !== null);
        res.status(200).send({ message: 'Explore conditions fetched successfully', exploreConditions });
    } catch (error) {
        console.error('Error fetching explore conditions:', error);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
});

router.get('/EatWellNutrition', async (req, res) => {
    try {
    //     const collections = await mongoose.connection.db.listCollections().toArray();
    //    // Filter collections with the prefix 'health_data_'
    //     const healthCollections = collections
    //     .filter(col => col.name.startsWith('health_data_')) // Match prefix
    //     .map(col => col.name); // Extract collection names

        // let allHealthData = [];
        // for (let collectionName of healthCollections) {
        // const Model = getHealthModel(collectionName); // Dynamic model
        // const data = await Model.find(); // Fetch data
        // allHealthData.push({ collectionName, data }); // Append data
        // }
        const data=await getHealthModel('health_data_Nutrition').find().limit(3);
        res.status(200).send({ status:true,data});
      
    } catch (error) {
      console.error('Error fetching health data:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.get('/moveyourbody', async (req,res) => {
    try {
        const data = await getHealthModel('health_data_Fitness').find().limit(3);
        res.status(200).send({ status:true, data });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
router.get('/relieveAnxiety', async (req,res) => {
    try {
        const data = await getHealthModel('health_data_Mental_health').find().limit(3);
        res.status(200).send({ status:true, data });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

router.get('/healthConditions',async(req, res)=>{
    try {
        const allHealthConditions = await healthConditionTable.find();
        res.status(200).send({message : 'all health conditions', allHealthConditions});
    } catch (error) {
        res.status(error.status).send({message : 'internal server error'});
    }
});

router.post('/searchConditions',async(req,res) => {
    try {
        const searchConditions = req.body.searchConditions;
        const data = await searched_conditionsTable({
            searchConditions : searchConditions,
        })
        await data.save();
        res.status(200).send({message:"search success"});
    } catch (error) {
        // console.log(error);
    }
})

// HealthConditionTitle

router.post('/HealthConditionTitle', async (req, res) => {
    try {
        const HealthCondition = req.body.HealthCondition;
        const HealthConditionTitle = await healthConditionTable.findOne({healthCondition : HealthCondition});
        res.status(200).send({ status: true, HealthConditionTitle});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// HealthType for particular health data

router.post('/HealthType', async (req, res) => {
    try {
        // const collections = await mongoose.connection.db.listCollections().toArray();

        // // Filter collections that start with "health_data_"
        // const healthCollections = collections
        //     .map(col => col.name)
        //     .filter(name => name.startsWith('health_data_'));

        // let aggregatedData = [];

        // // Iterate over each collection and query documents
        // for (const collectionName of healthCollections) {
        //     console.log('Querying collection:', collectionName);
        //     const HealthModel = getHealthModel(collectionName);

        //     const data = await HealthModel.find({ health_type: "Wellness" });
        //     console.log(`Data from ${collectionName}:`, data);

        //     aggregatedData = [...aggregatedData, ...data];
        // }

        // console.log('Aggregated Data:', aggregatedData);

        // res.status(200).send({ status: true, HealthTypeData: aggregatedData });
        const HealthType = req.body.HealthType;        
        const collections = await mongoose.connection.db.listCollections().toArray();
        const healthCollections = collections
            .map(col => col.name)
            .filter(name => name.startsWith('health_data_'));
            const dataPromises = healthCollections.map(async (collectionName) => {
            const HealthModel = getHealthModel(collectionName);
            const data = await HealthModel.find({ health_type:HealthType}); // Use lean() for faster queries
            return data.map(item => {
                if (item.image && item.image.data) {
                    item.image = {
                        ...item.image,
                        data: `data:image/jpeg;base64,${Buffer.from(item.image.data).toString('base64')}`
                    };
                }
                return item;
            });
        });
        const results = await Promise.all(dataPromises);
        const HealthTypeData = results.flat();
        res.status(200).send({ status: true, HealthTypeData });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// HealthCondition for particular HealthCondition data

router.post('/HealthCondition', async (req, res) => {
    try {
        const sanitizedHealthCondition = req.body.HealthCondition.replace(/\s+/g, '_');
        const HealthDataTable = `health_data_${sanitizedHealthCondition}`;
        if (!req.body.HealthCondition) {
            return res.status(404).send({ message: 'Health condition not found' });
        }
        const HealthModel = getHealthModel(HealthDataTable);
        const HealthCondition = await HealthModel.find(); // You can add query filters here if needed
        res.status(200).send({ status: true,HealthCondition});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.post('/HealthCdnNavbrUsingCond', async (req, res) => {
    try {
        // const cdn = req.params.healthCondition;
        // const HealthCondition = await healthConditionTable.findOne({healthCondition: cdn});
        res.status(200).send({status:true});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }

});


router.post('/HealthConditionNavbar', async (req, res) => {
    try {
        const { current_Health_Condition, currentHealthType } = req.body;
        // console.log(req.body);        
        let HealthConditionItm;
        if (current_Health_Condition) {
            const healthGroup = await health_group_collection.findOne({ health_condition: current_Health_Condition });
            if (!healthGroup) {
                return res.status(404).send({status: false, message: `No data found for health_condition: ${current_Health_Condition}.`,
                });
            }
            const { health_type } = healthGroup;
            HealthConditionItm = await health_group_collection.find({health_type}).lean();
        } else if (currentHealthType) {
            HealthConditionItm = await health_group_collection.find({health_type:currentHealthType}).lean();
            if (HealthConditionItm.length === 0) {
                return res.status(404).send({status: false, message: `No data found for health_type: ${currentHealthType}.`,
                });
            }
        }
        res.status(200).send({status: true,message: 'Data fetched successfully.',HealthConditionItm});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.post('/SearchCondition', async (req, res) => {
    try {
        const { searchText } = req.body;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const healthCollections = collections
            .map(col => col.name)
            .filter(name => name.startsWith('health_data_'));
        if (healthCollections.length === 0) {
            return res.status(404).send({ message: 'No health_data collections found' });
        }
        const dataPromises = healthCollections.map(async (collectionName) => {
            const HealthModel = getHealthModel(collectionName);
            return HealthModel.find({
                $or: [
                    { health_type: { $regex: searchText, $options: 'i' } },
                    { health_condition: { $regex: searchText, $options: 'i' } },
                    { health_name: { $regex: searchText, $options: 'i' } },
                    { title: { $regex: searchText, $options: 'i' } },
                    { reviewed_by: { $regex: searchText, $options: 'i' } }
                ]
            });
        });
        const results = await Promise.all(dataPromises);
        const searchedResults = results.flat().filter(doc => doc);
        if (searchedResults.length === 0) {
            return res.status(404).send({ message: 'No matching results found', searched: [] });
        }
        res.status(200).send({ message: 'Search successful', searched : searchedResults});
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.post('/healthgenious', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({ message: 'id is required' });
        }
        // Fetch all collection names starting with 'health_data_'
        const collections = await mongoose.connection.db.listCollections().toArray();
        const healthCollections = collections
            .map(col => col.name)
            .filter(name => name.startsWith('health_data_'));
        if (healthCollections.length === 0) {
            return res.status(404).send({ message: 'No health_data collections found' });
        }
        // Search across all matching collections by _id
        const dataPromises = healthCollections.map(async (collectionName) => {
            const HealthModel = getHealthModel(collectionName);
            return HealthModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
        });
        const results = await Promise.all(dataPromises);
        // Filter out null results and remove any empty arrays
        const searchedResults = results.filter(doc => doc !== null);
        if (searchedResults.length === 0) {
            return res.status(404).send({ message: 'No matching results found by the given _id', content: [] });
        }
        res.status(200).send({ message: 'Search successful', content: searchedResults });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
        console.log(error);
        
    }
});
// try {
//     const {currentHealthType,current_Health_Condition} = req.body;
//     console.log('nabar_health_type',currentHealthType);
//     console.log('navbar_health_con',current_Health_Condition);
//     if (!currentHealthType) {
//         return res.send({ status: false, message: 'currentHealthType is required' });
//     }
//     const HealthConditionItm = await health_group_collection.find({health_type:currentHealthType});
//     res.status(200).send({status: true, message: 'fetch success',HealthConditionItm});
// } catch (error) {
//     res.status(404).send({status:false, message: 'Internal Server Error'});
// }

module.exports = router;





// const zlib = require('zlib');
// const client = redis.createClient({
//     url: 'redis://127.0.0.1:6379'
// });

// client.on('connect', () => {
//     console.log('Redis connected');
// });

// client.connect();
// router.get('/healthgeniousData', async (req, res) => {
//     const start = Date.now(); // Start timer

//     try {
//         // Check if Redis client is connected
//         if (!client.isOpen) {
//             console.error('Redis client not connected');
//             return res.status(500).send({ status: false, message: 'Redis client not connected' });
//         }

//         console.log('Checking Redis cache...');
//         const cacheStart = Date.now();
//         let cachedData = await client.get('healthgeniousData');
//         console.log(`Redis GET Time: ${Date.now() - cacheStart} ms`);

//         if (cachedData) {
//             // If data is compressed, decompress it first
//             let decompressedData;
//             try {
//                 decompressedData = zlib.gunzipSync(Buffer.from(cachedData, 'base64')).toString('utf-8');
//             } catch (error) {
//                 // Handle decompression error
//                 console.error('Error decompressing data from Redis:', error);
//                 return res.status(500).send({ status: false, message: 'Error decompressing cached data' });
//             }

//             // Parse decompressed data as JSON
//             const healthgeniousData = JSON.parse(decompressedData);

//             console.log('Serving from Redis cache');
//             return res.status(200).send({
//                 status: true,
//                 message: 'Fetch success',
//                 healthgeniousData,
//                 timeTaken: `${Date.now() - start} ms` // Total time
//             });
//         }

//         // If not in cache, query the database
//         console.log('Fetching from MongoDB...');
//         const mongoStart = Date.now();
//         const healthgeniousData = await healthgenious_DataTable.find().sort({ _id: -1 });
//         console.log(`MongoDB Query Time: ${Date.now() - mongoStart} ms`);

//         // Cache the data in Redis (1 hour expiry)
//         console.log('Storing data in Redis...');
//         const cacheSetStart = Date.now();
//         const jsonData = JSON.stringify(healthgeniousData);

//         // Compress the data before storing in Redis (store as base64)
//         const compressedData = zlib.gzipSync(jsonData).toString('base64');
//         await client.setEx('healthgeniousData', 3600, compressedData); // 3600 seconds = 1 hour
//         console.log(`Redis SET Time: ${Date.now() - cacheSetStart} ms`);

//         // Send response with data from MongoDB
//         res.status(200).send({
//             status: true,
//             message: 'Fetch success',
//             healthgeniousData,
//             timeTaken: `${Date.now() - start} ms`
//         });

//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send({ status: false, message: 'Internal server error' });
//     }
// });
