import  AWSXRay from 'aws-xray-sdk-core';
import {DynamoDBClient}  from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';


import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess');


const ddbClient = new DynamoDBClient('us-east-1');
const dynamoDbXRay = AWSXRay.captureAWSv3Client(ddbClient)
const dynamodb = DynamoDBDocumentClient.from(dynamoDbXRay);


const todosTable  =  process.env.TODOS_TABLE;

export async function getTodos(userId) {
    logger.info('Getting all todo items');
    let queryParams = {
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const result = await dynamodb.send(new QueryCommand(queryParams));
    return result.Items;
  }

  export async function getTodo(userId, todoId) {
    logger.info(`Getting todo item: ${userId}  , ${todoId} `);
    let queryParams = {
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    }
    const result = await dynamodb.send(new QueryCommand(queryParams));
    const todoItem = result.Items[0];
    console.info('getTodo');
    console.info(result);
    return todoItem;
  }

  export async function createTodo(newTodo) {
    logger.info(`Creating new todo item: ${newTodo.todoId}`);
    let putItemParams = {
      TableName: todosTable,
      Item: newTodo
    }
    await dynamodb.send(new PutCommand(putItemParams));
    return newTodo;
  }

  export async function updateTodo(userId, todoId, updateData) {
    logger.info(`Updating a todo item: ${todoId}`);
    const item = await getTodo(userId, todoId);
    item.done = updateData.done;
    let pupdateItemParams = {
      TableName: todosTable,
      Item: item
    }
    await dynamodb.send(new PutCommand(pupdateItemParams));
    console.log('Updating done');
    return item;
  }

  export async function deleteTodo(userId, todoId) {
    console.log('deleteTodo1');
    console.log(userId);
    console.log(todoId);
    let removeItemParams = {
      TableName: todosTable,
      Key: { userId, todoId }
    }
    await dynamodb.send(new DeleteCommand(removeItemParams));
    console.log('deleteTodo2');
  }

  export async function saveImgUrl(userId, todoId, bucketName) {
    console.log('saveImgUrl1');
    const item = await getTodo(userId, todoId);
    item.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
    console.log(item);

    let pupdateItemParams = {
      TableName: todosTable,
      Item: item
    }
    console.log('saveImgUrl2');
    await dynamodb.send(new PutCommand(pupdateItemParams));
    console.log('saveImgUrl3');
  }