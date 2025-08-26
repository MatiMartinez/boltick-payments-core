import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { app } from "./server";

let serverlessExpressInstance: any;

async function setup(event: APIGatewayProxyEventV2, context: any) {
  console.log(JSON.stringify(event, null, 2));

  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Api-Key",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    };
  }

  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function onHandler(event: any, context: any) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context);

  return setup(event, context);
}

export const handler = onHandler;
