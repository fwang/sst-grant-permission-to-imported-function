import * as iam from "@aws-cdk/aws-iam";
import * as ssm from "@aws-cdk/aws-ssm";
import * as lambda from "@aws-cdk/aws-lambda";
import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Import Lambda function
    const fn = lambda.Function.fromFunctionAttributes(
      this,
      "EventsPublisherFunction",
      {
        functionArn: "arn:aws:lambda:us-east-1:1234567890:function:notes-app-api-prod-delete",
        role: iam.Role.fromRoleArn(
          this,
          `${id}-EventsPublisherFunctionRole`,
          "arn:aws:iam::1234567890:role/notes-app-api-prod-us-east-1-lambdaRole",
        ),
      }
    );

    // Create Queue
    const distributionDynamoDlq = new sst.Queue(this, "MyQueue", {
      sqsQueue: {
        queueName: `${this.stackName}-Queue`,
      },
    });
    distributionDynamoDlq.sqsQueue.grantSendMessages(fn);

    // Create Table
    const distributionDynamoTable = new sst.Table(this, "MyTable", {
      dynamodbTable: {
        tableName: `${this.stackName}-Table`,
      },
      fields: {
        pk: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "pk" },
      stream: true,
    });
    distributionDynamoTable.dynamodbTable.grantStreamRead(fn);
  }
}
