---
inclusion: fileMatch
fileMatchPattern: 'src/naming/**/*'
---

# Naming Utilities Guidelines

## Overview

The naming utilities provide consistent resource naming across all CDK stacks.

## Key Functions

### generateResourceName()

Generates resource names following the pattern: `{project}-{env}-{resourceType}-{resourceName}`

```typescript
import { generateResourceName } from '@codeiqlabs/aws-utils';

const functionName = generateResourceName({
  company: 'CodeIQLabs',
  project: 'SaaS',
  environment: 'nprd',
  resourceType: 'lambda',
  resourceName: 'api-savvue',
});
// Result: "saas-nprd-lambda-api-savvue"
```

### generateStackName()

Generates CloudFormation stack names following the pattern:
`{Company}-{Project}-{Environment}-{StackName}-Stack`

```typescript
import { generateStackName } from '@codeiqlabs/aws-utils';

const stackName = generateStackName({
  company: 'CodeIQLabs',
  project: 'SaaS',
  environment: 'nprd',
  stackName: 'Lambda-Savvue',
});
// Result: "CodeIQLabs-SaaS-NonProd-Lambda-Savvue-Stack"
```

### generateBucketName()

Generates S3 bucket names with random suffix for uniqueness:

```typescript
import { generateBucketName } from '@codeiqlabs/aws-utils';

const bucketName = generateBucketName({
  project: 'saas',
  environment: 'nprd',
  purpose: 'webapp-savvue',
});
// Result: "saas-nprd-webapp-savvue-a1b2c3"
```

## Naming Conventions

### Environment Mapping

- `nprd` → `NonProd`
- `prod` → `Prod`
- `mgmt` → `Management`

### Resource Type Prefixes

- Lambda: `lambda-`
- DynamoDB: `table-` (or omit for table names)
- S3: `bucket-` (or omit for bucket names)
- API Gateway: `api-`
- EventBridge: `bus-`, `rule-`

## Examples

### Lambda Function

```typescript
const apiLambda = generateResourceName({
  company: 'CodeIQLabs',
  project: 'SaaS',
  environment: 'nprd',
  resourceType: 'lambda',
  resourceName: 'api-savvue',
});
// "saas-nprd-lambda-api-savvue"
```

### DynamoDB Table

```typescript
const tableName = generateResourceName({
  company: 'CodeIQLabs',
  project: 'SaaS',
  environment: 'nprd',
  resourceType: 'table',
  resourceName: 'savvue',
});
// "saas-nprd-table-savvue"
```

### S3 Bucket

```typescript
const bucketName = generateBucketName({
  project: 'saas',
  environment: 'nprd',
  purpose: 'webapp-savvue',
});
// "saas-nprd-webapp-savvue-a1b2c3"
```

### EventBridge Bus

```typescript
const busName = generateResourceName({
  company: 'CodeIQLabs',
  project: 'SaaS',
  environment: 'nprd',
  resourceType: 'bus',
  resourceName: 'events',
});
// "saas-nprd-bus-events"
```

## Validation

Naming utilities include validation:

- Ensures required fields are present
- Validates length constraints
- Checks for invalid characters
- Enforces AWS naming rules

## Anti-Patterns

- ❌ Don't hardcode resource names - use naming utilities
- ❌ Don't skip environment parameter - it's required for consistency
- ❌ Don't create custom naming patterns - use provided utilities
- ❌ Don't use uppercase in resource names - AWS prefers lowercase
- ❌ Don't forget to add random suffix for globally unique resources (S3, ECR)
