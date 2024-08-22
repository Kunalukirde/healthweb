const express = require('express');
const router = express.Router();
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

const multer = require('multer');
const { ObjectId } = require('mongodb');

router.get('/',async (req,res) => {
    res.status(200).send({message:'HealthGenious server is running'});
});

router.post('/addhealthcodition',async (req,res)=> {
    try {
        const {healthCondition,healthCondition_description} =req.body;
        console.log(req.body);
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


// add health

const storage = multer.memoryStorage();
const upload = multer({storage : storage})
// ADD HEALTH DATA
router.post('/addHealth',upload.single('image'), async(req,res) => {
    const { health_type,health_type_description,health_condition,healthCondition_description,health_name,health_name_description,title,reviewed_by,content} = req.body;
    // console.log('body data', req.body);
    try {
        let image;
  
        if (req.file) {
            image = req.file.buffer;
        } else if (req.body.image) {
            image = Buffer.from(req.body.image, 'base64');
        } else {
            return res.status(400).send({ message: 'Image is required' });
        }
  
        let mappedContent = [];
  
        if (Array.isArray(content)) {
            // If content is an array, map over it
            mappedContent = content.map(c => ({
                main_title: c.main_title,
                topic_heading: c.topic_heading,
                topic_title: c.topic_title,
                topic_description: c.topic_description,
                topic_paragraph: c.topic_paragraph,
                topic_facts: c.topic_facts,
            }));
        } else {
            // If content is not an array, handle it accordingly (e.g., convert it to an array)
            mappedContent = [{
                main_title: content.main_title,
                topic_heading: content.topic_heading,
                topic_title: content.topic_title,
                topic_description: content.topic_description,
                topic_paragraph: content.topic_paragraph,
                topic_facts: content.topic_facts,
            }];
        }
  
        const health_data = new AddHealthTable({
            health_type:health_type,
            health_type_description:health_type_description,
            health_condition:health_condition,
            healthCondition_description:healthCondition_description,
            health_name:health_name,
            health_name_description:health_name_description,
            title: title,
            image:image,
            reviewed_by: reviewed_by,
            content: mappedContent
        });
  
        await health_data.save();
        const savedHealthData = await AddHealthTable.find({ title: title });
        // console.log('savedHealthData', savedHealthData);
        res.status(200).send({ status: true, message: 'Data saved successfully', savedHealthData });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

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
        console.log('body_Data',req.body);
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
