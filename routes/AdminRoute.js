const express = require('express');
const router = express.Router();
const WellnessDataTable = require('../models/wellnessData.js');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const wellnesstypeTable = require('../models/wellnesstype.js');




router.get('/', (req,res)=> {
    res.status(200).send({message : 'admin page'});
})

router.post('/wellnesstype',async(req,res)=> {
  try {
    const {addtypes}  = req.body;
    const doc = await new wellnesstypeTable({
      addtypes : addtypes
    });
    await doc.save();
    const savetype = await wellnesstypeTable.find({});
    res.status(200).send({status: true, message:"wellnesstype added", savetype:savetype});
   } 
   catch (error) {
    res.status(500).send({status : false, message : 'Internal Server Error'});
   }
  });

  router.get('/wellnesstype',async(req,res)=> {
    try {
      const wellensstypes = await wellnesstypeTable.find({});
      res.status(200).send({stautus: true, message:"fetch success", wellensstypes:wellensstypes} );
     } 
     catch (error) {
      res.status(500).send({status : false, message : 'Internal Server Error'});
     }
    });
  


const storage = multer.memoryStorage(); // Use memory storage for handling image data as buffers
const upload = multer({ storage: storage });
router.post('/AddWellnessData', upload.single('image'), async (req, res) => {
  const { wellnesstype, title, maintitle, content } = req.body;
  // console.log('content', content);

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
              heading: c.heading,
              paragraph: c.paragraph,
              facts: c.facts
          }));
      } else {
          // If content is not an array, handle it accordingly (e.g., convert it to an array)
          mappedContent = [{
              heading: content.heading,
              paragraph: content.paragraph,
              facts: content.facts
          }];
      }

      const wellnessData = new WellnessDataTable({
          wellnesstype: wellnesstype,
          image: image,
          title: title,
          maintitle: maintitle,
          content: mappedContent
      });

      await wellnessData.save();
      const savedWellnessData = await WellnessDataTable.find({ title: title });
      // console.log('savedWellnessData', savedWellnessData);
      res.status(200).send({ status: true, message: 'Data saved successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});


  router.get('/getAllWellness' ,async(req,res) => {
    try {
      const wellnessData = await WellnessDataTable.find();
      res.status(200).send({ message: 'fetched successfully',wellnessData });
      
    } catch (error) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })

  // delete wellness
  router.delete('/deleteWellness', async (req, res) => {
    try {
      const { _id } = req.body;  
      if (!_id) {
        console.error('Invalid _id parameter');
        return res.status(400).send({ message: 'Invalid _id parameter' });
      }
      const objectId = new ObjectId(_id);
      const deletedDoc = await WellnessDataTable.findOneAndDelete({ _id: objectId });
        res.status(200).send({ message: 'Deleted successfully', deletedDoc: deletedDoc.value });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });


module.exports = router;