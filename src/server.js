const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const multer = require('multer');
var fileExtension = require('file-extension');
const confRoute = require('./conf/route.json');
require('dotenv').config();
const port = process.env.PORT;

const swaggerUi = require('swagger-ui-express');
const DocumentationRouter = require('../docs/documentation');

const IMAGES_PATH = './public/images';

const DOCUMENTS_PATH = './public/documents';

let image_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
});

let document_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOCUMENTS_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
});

let image_upload = multer({
  storage: image_storage,
  limits: {
    // Setting Image Size Limit to 2MBs
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //Error 
      cb(new Error('Please upload JPG and PNG images only!'))
    }
    //Success 
    cb(undefined, true)
  }
});

let document_upload = multer({
  storage: document_storage,
  limits: {
    //fileSize: 2000000
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   //Error 
    //   cb(new Error('Please upload JPG and PNG images only!'))
    // }
    //Success 
    cb(undefined, true)
  }
});

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ extended: true, inflate: true, limit: '100kb', parameterLimit: 1000, type: 'application/json', verify: undefined }));
app.use(express.static('public'));
app.listen(port, () => { console.log(`listening on port ${port}`) });

for(let i = 0; i < confRoute.length; i++){
  app.use(confRoute[i].route, require(`${confRoute[i].router}`));
}

app.use('/api/v2/documentation', swaggerUi.serve, swaggerUi.setup(DocumentationRouter))

app.post('/api/upload/image', image_upload.single('ximagen'), function (req, res) {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.json({ data: { status: true, uploadedFile: file } });
}, (error, req, res, next) => {
    res.status(400).json({ data: { status: false, code: 400, message: err.message } });
});

app.post('/api/upload/document', document_upload.single('xdocumento'), function (req, res) {
  const file = req.file
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
  }
  res.json({ data: { status: true, uploadedFile: file } });
},
 (error, req, res, next) => {
  console.log(error.message)
  res.status(400).json({ data: { status: false, code: 400, message: error.message } });
});

