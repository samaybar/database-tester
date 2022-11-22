# database-tester

## Overview

This repository contains a lambda function that will allow you to compare the latency of a database with and without PolyScale. (Or any two databases with the same schema).

When configured, you can pass credentials for two databases, a sql query, and an amount of time (in seconds), and the function will compare the number of queries that it can run in that time period.

To install this you need to have the AWS cli and the AWS SAM cli (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed.

You may need to append a unique bucket name prefix in  `Makefile` on line 4

Once these configurations are made, from the root directory you can deploy both functions with:  
`make bucket` -- creates a S3 bucket to store the Lambda zip files.  
`make deploy` -- creates/updates the Lambda function and creates API Gateway in front of it.  
The output of the `deploy` will include the URL of the endpoint for the function.

By default, the Lambda function will be deployed to `us-east-1`.

You can alternatively deploy the function to any other AWS region with, eg:
`make reg=us-west-2 bucket`
`make reg=us-west-2 deploy`

## Usage
To run the Lambda function, you need to make a post request that includes the following body:
```
{
"databaseUrl1":"DATABASE1_URI", 
"databaseUrl2":"DATABASE2_URI",
"type": "postgres", // can be "postgres" or "mysql"
"time":5, //number of seconds to run queries for, max of 20 seconds
"sql":"SELECT * from todos"  //sql query to run
}
```

If you are using a PolyScale cache for one of your database comparisons, your Datbase URI might look like:
`postgres://[USERNAME]:[PASSWORD]@psedge.global:5432/postgres?application_name=[POLYSCALE_CACHE_ID]`

```
curl --request POST 'https://YOUR_LAMBDA_URL' \
  --header 'Content-Type: application/json' \
  --data '{"databaseUrl1":"DATABASE1_URI","databaseUrl2":"DATABASE2_URI","type":"postgres","time":5,"sql":"SELECT * from todos"}'
```

The function will return the number of queries run for each database and the average time (in milliseconds) per query run.

