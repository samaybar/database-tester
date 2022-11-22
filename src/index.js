"use strict";

const delay = ms => new Promise(res => setTimeout(res, ms));

exports.handler = async (event) => {
    //get payload from post
    const postData = JSON.parse(event.body);
    const { databaseUrl, time, sql, type } = postData;

const db = require("knex")({
  client: "pg",
  connection: databaseUrl
});
let query = sql;
 
let output = {};
const startTime = Date.now();
const endTime = startTime + time;
let counter = 0;
let timer = startTime
while (timer < endTime){
  try {
  

        const out = await db.raw(query);
        if(counter === 0){
        output = out.rows;
        }
        counter++;
        // const endTime = Date.now();
        // const thisTime = endTime-startTime;
        timer = Date.now();
        // totalTime += thisTime;
        // console.log(`${i} - ${thisTime} - ${JSON.stringify(out[0])}`);
    }
    // const averageTime = totalTime / loopSize;
    // console.log(`Done - avg time ${averageTime}`);
    
    
  catch (e) {
    console.log(e);
  }
}
  

    console.log(databaseUrl);
    console.log(time);
    console.log(sql);
    // await delay(time);
    console.log(JSON.stringify(postData));
    const responseBody = { databaseUrl, time, sql, output, counter }
    // const responseBody = postData;
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
      };
    return response;
}