import * as cdk from "@aws-cdk/core";
import MyStack from "./MyStack";

export default function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x"
  });
  app.setDefaultRemovalPolicy(cdk.RemovalPolicy.DESTROY);

  new MyStack(app, "stack-a");
  new MyStack(app, "stack-b");
}
