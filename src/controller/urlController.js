const urlModel = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");


//---------------------------Valiadtions-----------------------------------------//
//request body validation
const isValidRequest = function (request) {
    return Object.keys(request).length > 0;
};
//value validation
const isValidValue = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === 'number' ) return false
    return true;
};

//---------------------------------------------------Shorten Url API-----------------------------------------------------------------//
const shortenUrl = async (req, res) => {
    try {
        let longUrl = req.body.longUrl
        //input validation
        if (!isValidRequest(req.body)) return res.status(400).send({ status: false, message: "No input by user" })

        if (!isValidValue(longUrl)) return res.status(400).send({ status: false, message: "longUrl is required." })


        //validation for Long Url
        if (!validUrl.isWebUri(longUrl)) return res.status(400).send({ status: false, message: "Long Url is invalid." })

        let baseUrl = "http://localhost:3000"



        //if the Long url is already exist

        // check for data in the Database
        const alreadyExistUrl = await urlModel.findOne({ longUrl: longUrl }).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })

        if (alreadyExistUrl) {
            return res.status(400).send({ status: false, message: "Shorten link already generated previously", data: alreadyExistUrl })
        } else {

            let shortUrlCode = shortid.generate()

            //if the Urlcode is already existm( rare purpouse)
            const alreadyExistCode = await urlModel.findOne({ urlCode: shortUrlCode })
            if (alreadyExistCode) return res.status(400).send({ status: false, message: "It seems You Have To Hit The Api Again" })

            let shortUrl = baseUrl + '/' + shortUrlCode


            const generateUrl = {
                longUrl: longUrl,
                shortUrl: shortUrl,
                urlCode: shortUrlCode
            }


            let createUrl = await urlModel.create(generateUrl)


            return res.status(201).send({ status: true, message: "Short url Successfully created", data: generateUrl} )
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getURL = async function (req, res) {
    try {
      let urlCode = req.params;
  
      const findUrlCode = await urlModel.findOne(urlCode).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
  
      if(!findUrlCode) return res.status(400).send({status: false, message: "url code not matched"})

      return res.status(302).redirect(findUrlCode.longUrl)
  
    } catch (error) {
      
        return  res.status(500).send({ status: false, error: error.message });
    }
  };

module.exports = { shortenUrl, getURL };