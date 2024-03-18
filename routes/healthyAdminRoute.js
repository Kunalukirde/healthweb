const express = require('express');
const router = express.Router();
const AddHealthconstionTable = require('../models/healthmain/healthCondition.js');
const AddHealthNameTable = require('../models/healthmain/healthName.js');
const healthConditionTable = require('../models/healthmain/healthCondition.js');
const healthNameTable = require('../models/healthmain/healthName.js');
const HealthTypeTable = require('../models/healthmain/healthType.js');
const AddHealthTable = require('../models/AddHealth.js');
const multer = require('multer');
const { ObjectId } = require('mongodb');

router.get('/',async (req,res) => {
    res.status(200).send({message:'Healthy server is running'});
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
        const {healthname} =req.body;
        const doc = await AddHealthNameTable({
            healthname:healthname
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
        const {healthtype} =req.body;
        const doc = await HealthTypeTable({
            healthtype:healthtype
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
    const { health_type,health_condition,healthCondition_description,health_name,title,reviewed_by,content} = req.body;
    console.log('body data', req.body);
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
  
        const wellnessData = new AddHealthTable({
            health_type:health_type,
            health_condition:health_condition,
            healthCondition_description:healthCondition_description,
            health_name:health_name,
            title: title,
            image:image,
            reviewed_by: reviewed_by,
            content: mappedContent
        });
  
        await wellnessData.save();
        const savedHealthData = await AddHealthTable.find({ title: title });
        // console.log('savedHealthData', savedHealthData);
        res.status(200).json({ status: true, message: 'Data saved successfully', savedHealthData });
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
        res.status(200).send({ message: 'Deleted successfully', deletedDoc: deletedDoc.value });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });





module.exports = router;
