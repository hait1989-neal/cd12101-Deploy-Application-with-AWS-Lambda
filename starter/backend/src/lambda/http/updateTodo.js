import middy from '@middy/core'
import cors from '@middy/http-cors'
import { updateTodoApi } from '../../businessLogic/todos.js'

async function updateTodoHandler(event) {

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
    const updatedTodo = JSON.parse(event.body)
    const item = await updateTodoApi(todoId, updatedTodo, jwtToken);
    return {
      statusCode: 204,
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

export const handler = middy(updateTodoHandler).use(cors({ credentials: true }));
