const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const validator = require('../validator/validator')


exports.createBook = async (req, res) => {

    try {

        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "you have to enter all details" })

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "title required" })
        }
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "excerpt required" })
        } if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId required" })
        } 
        if (!validator.isValidObjectId(userId)) {
            return res.status(403).send({ status: false, msg: "provide valid userId" })
        } 
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, msg: "category required" })
        }
        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN required" })
        }
        if (!/^(\d{13})?$/.test(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid ISBN number" })
        }
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory required" })
        }
        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "releasedAt required" })
        }
        
        if(!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) 
        { return res.status(400).send({ status: false, msg: "Please enter date in YYYY-MM-DD" }) }


        const checkUserId = await userModel.findOne({ userId: userId })
        if (!checkUserId) { return res.status(400).send({ status: false, msg: "UserId not found" }) }

        const checktitle = await bookModel.findOne({ title: title })
        if (checktitle) { return res.status(400).send({ status: false, msg: "title already exists please enter new title" }) }

        const checkIsbn = await bookModel.findOne({ ISBN: ISBN })
        if (checkIsbn) { return res.status(400).send({ status: false, msg: "ISBN already exists please enter new ISBN" }) }

        const saveBook = await bookModel.create(req.body)
        return res.status(201).send({ status: true, message: "Book successfully created", data: saveBook })
    }


     catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }


}


exports.getBooks = async (req, res) => {

    try {
        let query = req.query;  //getting data from query params

        // if (Object.keys(query).length == 0) {  //this block will work in case no filter is provided
        //     const book = await bookModel.find({ isDeleted: false });
        //     if (book.length == 0) return res.status(404).send({ status: false, msg: "No such book exist" });
        //     return res.status(200).send({ status: true, data: book })
        // }

        let filter = {
            isDeleted: false
        };
        if (Object.keys(query).length !== 0) { //this block will work in case filter is provided
            
            if (query.subcategory) {
                query.subcategory = { $in: query.subcategory.split(",") };
            }
            filter['$or'] = [
                { userId: query.userId },
                { category: query.category },
                { subcategory: query.subcategory }
            ];
        }

        let filterByquery = await bookModel.find(filter) //finding book from database 
       return res.status(200).send({ msg: filterByquery });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }

    // try {

    //     let data = req.query;

    //     //validate =query params
    //     if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data in query params" });

    // //      if (data.hasOwnProperty('userId')) {
    // //         if (!validator.isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: "Enter a valid user id" });
    // //          let { ...tempData } = data;
    // //         delete (tempData.userId);
    // //          let checkValues = Object.values(tempData);

    // //         if (!validator.validString(checkValues)) return res.status(400).send({ status: false, message: "Filter data should not contain numbers excluding user id" })
    // //  } else {
    // //          //let checkValues = Object.values(data);

    // //          //if (!validator.validStr(checkValues)) return res.status(400).send({ status: false, message: "Filter data should not contain numbers excluding user id" })
    // //     }
    //     data.isDeleted = false;

    //     let getFilterBooks = await bookModel.find(data).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });

    //     if (getFilterBooks.length == 0) return res.status(404).send({ status: false, message: "No books found" });
    //     res.status(200).send({ status: true, count: getFilterBooks.length, message: "Books list", data: getFilterBooks });

    // } catch (error) {
    //     return res.status(500).send({ status: false, message: error.message });

    // }
}