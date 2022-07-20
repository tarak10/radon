const urlModel = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");

const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13224,
    "redis-13224.c261.us-east-1-4.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("bpbAcN0vNBUHk2nza7H8i1exy9Q69PyU", function (err) {
    if (err) throw err;
})

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//---------------------------Valiadtions-----------------------------------------//
//request body validation
const isValidRequest = function (request) {
    return Object.keys(request).length > 0;
};
//value validation
const isValidValue = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === 'number') return false
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

        // validation for base Url
        if (!validUrl.isWebUri(baseUrl)) return res.status(400).send({ status: false, message: `${baseUrl} is invalid base Url` })


        //if the Long url is already exist

        //  check for data in the cache
         let cachedlinkdata = await GET_ASYNC(`${req.body.longUrl}`)

         if (cachedlinkdata) {
             let change = JSON.parse(cachedlinkdata)
            return res.status(200).send({ status: true,msg:"data found in Redis", redisdata: change })
         }

        // check for data in the Database
        const alreadyExistUrl = await urlModel.findOne({ longUrl: longUrl }).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })

        if (alreadyExistUrl) {
            //setting data in cache
            await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(alreadyExistUrl));
            return res.status(200).send({ status: true, message: "Shorten link already generated previously"})
        } else {

            let shortUrlCode = shortid.generate().toLowerCase();

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

            // setting data in cache
             await SET_ASYNC(`${longUrl}`, JSON.stringify(generateUrl))

            return res.status(201).send({ status: true, message: "Short url Successfully created", data: generateUrl })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//---------------------------------------------------Get Url API-----------------------------------------------------------------//
const getUrl = async (req, res) => {
    try {
        const urlCode = req.params.urlCode;
        let urlcache = await GET_ASYNC(`${urlCode}`);
        if (urlcache) {
            return res.status(302).redirect(JSON.parse(urlcache));
        } else {
            const UrlDb = await urlModel.findOne({ urlCode: urlCode });
            if (UrlDb) {
                await SET_ASYNC(`${urlCode}`, JSON.stringify(UrlDb.longUrl));
                return res.status(302).redirect(UrlDb.longUrl);
            } else {
                return res.status(404).send({ status: false, msg: "No URL Found" });
            }
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { shortenUrl, getUrl };