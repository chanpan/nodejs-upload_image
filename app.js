const express = require("express");
const multer = require("multer");
const path = require('path');

//set stoorage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
//init upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).array('myImage', 10);

//checkFiletype
function checkFileType(file, cb) {
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error : Images Only!");
    }
}

const app = express();
const port = 3000;

//public folder
app.use(express.static('./public'));
app.use(express.static('./views'));

//server
app.get('/', (req, res) => res.render('views/index.html'));
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log({ msg: err });
        } else {
            console.log(req.file);
            res.send('test');
        }
    });
});

app.listen(port, () => console.log(`http:://localhost:${port}`));