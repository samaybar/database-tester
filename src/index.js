"use strict";
const knex = require("knex");

async function getData(databaseUrl, type, sql, time) {
  //select driver to use, default to postgres
  let client = "pg"
  if (type == "mysql"){
    client = "mysql2"
  }
  const db = knex({
    client: client,
    connection: databaseUrl
  });
  let query = sql;
  
  let output = {};
 
  let counter = 0;
  let totalTime = 0;
  let startTime;
  let coldStartTime;

  let host = 'NA';
  try {
    //warm db & cache
    const timePreColdStart = Date.now();
    const out1 = await db.raw(query);
    const timePostColdStart = Date.now();
    coldStartTime = timePostColdStart - timePreColdStart;
    if (type === "postgres"){
      output = out1.rows;
    } else if (type === "mysql"){
      output = out1[0];
    }
    host = db.client.config.connection.host;
    startTime = Date.now();
    const endTime = startTime + time;
    let timer = startTime;
    while (timer < endTime){
        timer = Date.now();
        const out = await db.raw(query);
        if(counter === 0){
          if (type === "postgres"){
            output = out.rows;
          } else if (type === "mysql"){
            output = out[0];
          }
        }
        counter++;
      } 
  } catch (e) {
    console.log(e);
    let message = "something went wrong";
    if (host ==="NA"){
      message = "no database provided";
    }
    output = {"message":message,"error":e};
  }
  const finishTime = Date.now();
  totalTime = finishTime - startTime;
  const avgResponseTime = Math.round(totalTime*10/counter)/10;
  const payload = { host: host, output: output, requestsMade: counter, totalTime: totalTime, avgResponseTime: avgResponseTime, firstResponeTime: coldStartTime};
  return payload;
} 

exports.handler = async (event) => {
    //get payload from post
    const postData = JSON.parse(event.body);
    const { databaseUrl1, databaseUrl2, time, sql, type } = postData;
    const loopTime = 1000 * Math.min(time,20);
    // const [db1, db2] = await Promise.all([
    //   getData(databaseUrl1, type, sql, loopTime),
    //   getData(databaseUrl2, type, sql, loopTime)
    // ])
    const db1 = await getData(databaseUrl1, type, sql, loopTime);
    const db2 = await getData(databaseUrl2, type, sql, loopTime);

    const responseBody = { db1, db2, time, sql }
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
      };
    return response;
}