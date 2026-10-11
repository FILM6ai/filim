import express from 'express';
import { getmetaData, postmetaData, updatemetaData } from
 '../controllers/metaDataController.js';

const metaRouter = express.Router();

metaRouter.get('/getmetadata', getmetaData);
metaRouter.post('/postmetadata', postmetaData);
metaRouter.put('/updatemetadata/:id', updatemetaData);


export default metaRouter;
