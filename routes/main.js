const express = require('express');
const router = express.Router();

//Importing MiddleWare
const checkPage = require('../middleware/isPageAvailable')
const Confluence = require("confluence-api");
const { Client } = require("@notionhq/client");


//Importing Notion & confluence
const notion = new Client({
    auth: process.env.NOTION_KEY,
})
const configConfluence = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_TOKEN,
    baseUrl : process.env.CONFLUENCE_URL
}
const confluence = new Confluence(configConfluence);

//Importing Controllers
const mc = require('../controller/main.js');
const { default: axios } = require('axios');

router.get('/',mc.homePage);

router.get('/input',mc.input);

router.post('/startProcess', async(req,res)=> {
    try {
        const {
            confluenceWorkSpaceName,
            notionPageId,
        } = req.body;
        const id = notionPageId.split("");
        let page_id = "";
        id.forEach((i,idx) => {
            page_id+=i;
            if(idx==7) page_id+="-";
            if(idx==11) page_id+="-";
            if(idx==15) page_id+="-";
            if(idx==19) page_id+="-";
        })
        
        const responseNotionAPI = await notion.pages.retrieve({page_id })
        const title = responseNotionAPI.properties.title.title[0].plain_text;
        if(!title) {
            return res.status(401).json({message:"No page with this ID was found."})
        }
        const bodyData = `{
            "space": {
              "key": "${confluenceWorkSpaceName}"
            },
            "type": "page",
            "title": "${title}",
            "body": {
              "storage": {
                "value": "",
                "representation": "storage"
              }
            }
          }
          `;
        const buffer = Buffer.from(process.env.CONFLUENCE_TOKEN);
        const string = buffer.toString("base64");
        const CONFLUENCE_TOKEN = `Basic ${string}`;
        let response = await axios({
            method: "post",
            url: "https://yashjoshi.atlassian.net/wiki/rest/api/content",
            data: bodyData,
            headers: {
              Authorization: CONFLUENCE_TOKEN,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        res.json({
            message:"Success",
            data:response.data
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({error,message:error.message})
    }
});

module.exports = router;