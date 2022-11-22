"use strict";


async function getData(databaseUrl, type, sql, time) {
  //select driver to use, default to postgres
  let client = "pg"
  if (type == "mysql"){
    client = "mysql2"
  }
  const db = require("knex")({
    client: client,
    connection: databaseUrl
  });
  let query = sql;
  
  let output = {};
 
  let counter = 0;
  let totalTime = 0;
  let startTime;

  let host = 'NA';
  try {
    //warm cache
    const out1 = await db.raw(query);
    output = out1.rows;
    host = db.client.config.connection.host;
    startTime = Date.now();
    const endTime = startTime + time;
    let timer = startTime;
    while (timer < endTime){
        const out = await db.raw(query);
        if(counter === 0){
          output = out.rows;
        }
        counter++;
        timer = Date.now();
      } 
  } catch (e) {
    console.log(e);
    let message = "something went wrong";
    if (host ==="NA"){
      message = "no database provided";
    }
    output = {"message":"something went wrong","error":e};
  }
  const finishTime = Date.now();
  totalTime = finishTime - startTime;
  const avgResponseTime = Math.round(totalTime*10/counter)/10;
  const payload = {output: output, requestsMade: counter, host: host, totalTime: totalTime, avgResponseTime: avgResponseTime};
  return payload;
} 

exports.handler = async (event) => {
    //get payload from post
    const postData = JSON.parse(event.body);
    const { databaseUrl1, databaseUrl2, time, sql, type } = postData;
    const loopTime = 1000 * Math.min(time,20);
    const [db1, db2] = await Promise.all([
      getData(databaseUrl1, type, sql, loopTime),
      getData(databaseUrl2, type, sql, loopTime)
    ])


    const responseBody = { db1, db2, time, sql }
    // const responseBody = postData;
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
      };
    return response;
}