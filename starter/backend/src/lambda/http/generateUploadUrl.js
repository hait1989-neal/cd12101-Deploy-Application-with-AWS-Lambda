import middy from '@middy/core'
import cors from '@middy/http-cors'
import { generateUploadUrl } from '../../businessLogic/todos.js'


async function generateUploadUrHandler(event)  {
  console.log('Processing event: ', event);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };
  try {
    const todoId = event.pathParameters.todoId
    const signedUrl = await generateUploadUrl(jwtToken, todoId);
    console.info('Successfully created signed url.');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ uploadUrl: signedUrl })
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};

export const handler = middy(generateUploadUrHandler).use(cors({ credentials: true }));


