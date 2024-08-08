import * as uuid from 'uuid';
import AWS from 'aws-sdk';
import { getTodos, createTodo, getTodo, saveImgUrl, updateTodo, deleteTodo } from '../dataLayer/todosAccess.js';
import { parseUserId } from '../auth/utils.mjs';


export async function getAllTodos(jwtToken) {
    const userId = parseUserId(jwtToken);
    return getTodos(userId)
}

export async function createTodoApi(createTodoRequest, jwtToken) {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);
  
    return createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        done: false,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString()
    });
}

export async function getTodoItem(todoId, jwtToken) {
    const userId = parseUserId(jwtToken);
    return await getTodo(todoId, userId);
}

export async function updateTodoApi(todoId, updateTodoRequest, jwtToken) {
    console.log("Updating Item");
    console.log(updateTodoRequest);
    console.log(todoId);
    const userId = parseUserId(jwtToken);

    const todoItem = await getTodoItem(todoId, userId);
  
    await updateTodo(todoItem.todoId, todoItem.createdAt, {
        name: updateTodoRequest.name,
        done: updateTodoRequest.done,
        dueDate: updateTodoRequest.dueDate,
    });
}

export async function deleteTodoApi(itemId, jwtToken) {
    const userId = parseUserId(jwtToken);
    const todoItem = await getTodoItem(itemId, userId);
    await deleteTodo(todoItem.todoId, todoItem.createdAt);
}

export async function generateUploadUrl(jwtToken, todoId) {
    console.log("Setting Item URL");
    const userId = parseUserId(jwtToken);
    console.log(userId);
    const bucketName = process.env.IMAGES_S3_BUCKET;
    const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);

    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    console.log(s3);
    console.log(bucketName);
    console.log(todoId);
    console.log(urlExpiration);
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    });
    console.log('done');
    console.log('signedUrl');
    await saveImgUrl(userId, todoId, bucketName);
    return signedUrl;
  }
