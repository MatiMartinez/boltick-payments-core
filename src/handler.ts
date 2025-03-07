import serverlessExpress from '@codegenie/serverless-express';

import { app } from './server';

let serverlessExpressInstance: any;

async function setup(event: any, context: any) {
  console.log(JSON.stringify(event, null, 2));

  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function onHandler(event: any, context: any) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context);

  return setup(event, context);
}

export const handler = onHandler;
