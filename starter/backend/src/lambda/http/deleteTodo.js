import middy from '@middy/core'
import cors from '@middy/http-cors'
import { deleteTodoApi  } from '../../businessLogic/todos.js'

async function deleteTodoHandler(event) {
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
    await deleteTodoApi(todoId, jwtToken);
    console.log(item);
    return {
      statusCode: 204,
      headers,
      body: undefined
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

export const handler = middy(deleteTodoHandler).use(cors({ credentials: true }));
