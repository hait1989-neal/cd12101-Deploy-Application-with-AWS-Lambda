import middy from '@middy/core'
import cors from '@middy/http-cors'
import { getAllTodos } from '../../businessLogic/todos.js'

async function  getTodosHandler(event)  {
  console.log('Processing event: ', event);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };
  try {
    const todos = await getAllTodos(jwtToken);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items: todos
      })
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

export const handler = middy(getTodosHandler).use(cors({ credentials: true }));


