import multer from 'multer';
import path from 'path';
import __dirname from '../utils.js';
import { productsService } from '../managers/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dynamicFolder;
    switch (req.baseUrl) {
      case '/api/products':
        dynamicFolder = 'products';
        break;
    }
    return cb(null, path.join(__dirname, '/public/files/', dynamicFolder));
  },
  filename: async function (req, file, cb) {
    const productId = req.body.productId || req.params.productId;
    const productName = await productsService.getProductById(productId);

    const originalFilename = file.originalname;
    const combinedFilename = `${productName}-${originalFilename}`;

    return cb(null, combinedFilename);
  },
});

const uploader = multer({ storage });

export default uploader;
