import middy from '@middy/core'
import cors from '@middy/http-cors'
import { createTodoApi  } from '../../businessLogic/todos.js'



async function createTodoHandler(event) {

  console.log('Processing event: ', event);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };
  try {
    const newTodo = JSON.parse(event.body);
    const item = await createTodoApi(newTodo, jwtToken);
    console.log(item);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        item: item
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

export const handler = middy(createTodoHandler).use(cors({ credentials: true }));

