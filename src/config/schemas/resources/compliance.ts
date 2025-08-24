import { z } from 'zod';
import {
  BooleanSchema,
  ConfigModeSchema,
  NameSchema,
  DescriptionSchema,
  TagsSchema,
} from '../base';

/**
 * Compliance configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for AWS compliance and security services
 * including CloudTrail, Config, GuardDuty, Security Hub, and other compliance tools.
 */

/**
 * S3 bucket configuration for CloudTrail logs
 */
export const CloudTrailS3ConfigSchema = z.object({
  bucketName: NameSchema,
  keyPrefix: z.string().optional(),
  includeGlobalServiceEvents: BooleanSchema.default(true),
  isMultiRegionTrail: BooleanSchema.default(true),
  enableLogFileValidation: BooleanSchema.default(true),
});

/**
 * CloudWatch Logs configuration for CloudTrail
 */
export const CloudTrailCloudWatchConfigSchema = z.object({
  logGroupName: NameSchema,
  roleArn: z
    .string()
    .regex(/^arn:aws:iam::\d{12}:role\/.*$/, 'Invalid IAM role ARN')
    .optional(),
});

/**
 * CloudTrail event selector configuration
 */
export const CloudTrailEventSelectorSchema = z.object({
  readWriteType: z.enum(['All', 'ReadOnly', 'WriteOnly']).default('All'),
  includeManagementEvents: BooleanSchema.default(true),
  dataResources: z
    .array(
      z.object({
        type: z.string(), // e.g., "AWS::S3::Object"
        values: z.array(z.string()), // e.g., ["arn:aws:s3:::bucket/*"]
      }),
    )
    .optional(),
  excludeManagementEventSources: z.array(z.string()).optional(),
});

/**
 * CloudTrail insight selector configuration
 */
export const CloudTrailInsightSelectorSchema = z.object({
  insightType: z.enum(['ApiCallRateInsight']),
});

/**
 * CloudTrail configuration
 */
export const CloudTrailConfigSchema = z.object({
  name: NameSchema,
  enabled: BooleanSchema.default(true),
  s3Config: CloudTrailS3ConfigSchema,
  cloudWatchConfig: CloudTrailCloudWatchConfigSchema.optional(),
  eventSelectors: z.array(CloudTrailEventSelectorSchema).optional(),
  insightSelectors: z.array(CloudTrailInsightSelectorSchema).optional(),
  kmsKeyId: z.string().optional(), // KMS key for encryption
  snsTopicName: NameSchema.optional(),
  tags: TagsSchema,
});

/**
 * AWS Config delivery channel configuration
 */
export const ConfigDeliveryChannelSchema = z.object({
  name: NameSchema,
  s3BucketName: NameSchema,
  s3KeyPrefix: z.string().optional(),
  snsTopicArn: z
    .string()
    .regex(/^arn:aws:sns:.*$/, 'Invalid SNS topic ARN')
    .optional(),
  deliveryFrequency: z
    .enum(['One_Hour', 'Three_Hours', 'Six_Hours', 'Twelve_Hours', 'TwentyFour_Hours'])
    .default('TwentyFour_Hours'),
});

/**
 * AWS Config configuration recorder
 */
export const ConfigRecorderSchema = z.object({
  name: NameSchema,
  roleArn: z
    .string()
    .regex(/^arn:aws:iam::\d{12}:role\/.*$/, 'Invalid IAM role ARN')
    .optional(),
  recordingGroup: z
    .object({
      allSupported: BooleanSchema.default(true),
      includeGlobalResourceTypes: BooleanSchema.default(true),
      resourceTypes: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * AWS Config rule configuration
 */
export const ConfigRuleSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema.optional(),
  source: z.object({
    owner: z.enum(['AWS', 'CUSTOM_LAMBDA']),
    sourceIdentifier: z.string(), // AWS managed rule name or Lambda function ARN
    sourceDetails: z
      .array(
        z.object({
          eventSource: z.string(),
          messageType: z.string(),
          maximumExecutionFrequency: z
            .enum(['One_Hour', 'Three_Hours', 'Six_Hours', 'Twelve_Hours', 'TwentyFour_Hours'])
            .optional(),
        }),
      )
      .optional(),
  }),
  inputParameters: z.record(z.string()).optional(),
  scope: z
    .object({
      complianceResourceTypes: z.array(z.string()).optional(),
      tagKey: z.string().optional(),
      tagValue: z.string().optional(),
    })
    .optional(),
});

/**
 * AWS Config conformance pack configuration
 */
export const ConfigConformancePackSchema = z.object({
  name: NameSchema,
  templateS3Uri: z.string().url().optional(),
  templateBody: z.string().optional(),
  deliveryS3Bucket: NameSchema.optional(),
  deliveryS3KeyPrefix: z.string().optional(),
  inputParameters: z.record(z.string()).optional(),
});

/**
 * AWS Config configuration
 */
export const ConfigServiceConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  recorder: ConfigRecorderSchema,
  deliveryChannel: ConfigDeliveryChannelSchema,
  rules: z.array(ConfigRuleSchema).optional(),
  conformancePacks: z.array(ConfigConformancePackSchema).optional(),
});

/**
 * GuardDuty finding publishing configuration
 */
export const GuardDutyFindingPublishingSchema = z.object({
  frequency: z.enum(['FIFTEEN_MINUTES', 'ONE_HOUR', 'SIX_HOURS']).default('SIX_HOURS'),
  destinationArn: z.string().regex(/^arn:aws:s3:::.*$/, 'Invalid S3 bucket ARN'),
  kmsKeyArn: z
    .string()
    .regex(/^arn:aws:kms:.*$/, 'Invalid KMS key ARN')
    .optional(),
});

/**
 * GuardDuty configuration
 */
export const GuardDutyConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  findingPublishing: GuardDutyFindingPublishingSchema.optional(),
  malwareProtection: BooleanSchema.default(true),
  s3Protection: BooleanSchema.default(true),
  eksProtection: BooleanSchema.default(true),
  rdsProtection: BooleanSchema.default(true),
  lambdaProtection: BooleanSchema.default(true),
  invitationId: z.string().optional(), // For member accounts
  masterId: z.string().optional(), // For member accounts
});

/**
 * Security Hub standards subscription
 */
export const SecurityHubStandardSchema = z.object({
  arn: z.string().regex(/^arn:aws:securityhub:.*$/, 'Invalid Security Hub standard ARN'),
  enabled: BooleanSchema.default(true),
});

/**
 * Security Hub configuration
 */
export const SecurityHubConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  enableDefaultStandards: BooleanSchema.default(true),
  standards: z.array(SecurityHubStandardSchema).optional(),
  autoEnableControls: BooleanSchema.default(true),
});

/**
 * Inspector V2 configuration
 */
export const InspectorConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  enableEc2: BooleanSchema.default(true),
  enableEcr: BooleanSchema.default(true),
  enableLambda: BooleanSchema.default(true),
});

/**
 * Access Analyzer configuration
 */
export const AccessAnalyzerConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  analyzerName: NameSchema,
  type: z.enum(['ACCOUNT', 'ORGANIZATION']).default('ACCOUNT'),
  archiveRules: z
    .array(
      z.object({
        ruleName: NameSchema,
        filter: z.record(z.array(z.string())),
      }),
    )
    .optional(),
});

/**
 * Complete compliance configuration schema
 */
export const ComplianceConfigSchema = z.object({
  mode: ConfigModeSchema.default('create'),
  cloudTrail: CloudTrailConfigSchema.optional(),
  configService: ConfigServiceConfigSchema.optional(),
  guardDuty: GuardDutyConfigSchema.optional(),
  securityHub: SecurityHubConfigSchema.optional(),
  inspector: InspectorConfigSchema.optional(),
  accessAnalyzer: AccessAnalyzerConfigSchema.optional(),
});

// Export types for TypeScript usage
export type CloudTrailS3Config = z.infer<typeof CloudTrailS3ConfigSchema>;
export type CloudTrailCloudWatchConfig = z.infer<typeof CloudTrailCloudWatchConfigSchema>;
export type CloudTrailEventSelector = z.infer<typeof CloudTrailEventSelectorSchema>;
export type CloudTrailInsightSelector = z.infer<typeof CloudTrailInsightSelectorSchema>;
export type CloudTrailConfig = z.infer<typeof CloudTrailConfigSchema>;
export type ConfigDeliveryChannel = z.infer<typeof ConfigDeliveryChannelSchema>;
export type ConfigRecorder = z.infer<typeof ConfigRecorderSchema>;
export type ConfigRule = z.infer<typeof ConfigRuleSchema>;
export type ConfigConformancePack = z.infer<typeof ConfigConformancePackSchema>;
export type ConfigServiceConfig = z.infer<typeof ConfigServiceConfigSchema>;
export type GuardDutyFindingPublishing = z.infer<typeof GuardDutyFindingPublishingSchema>;
export type GuardDutyConfig = z.infer<typeof GuardDutyConfigSchema>;
export type SecurityHubStandard = z.infer<typeof SecurityHubStandardSchema>;
export type SecurityHubConfig = z.infer<typeof SecurityHubConfigSchema>;
export type InspectorConfig = z.infer<typeof InspectorConfigSchema>;
export type AccessAnalyzerConfig = z.infer<typeof AccessAnalyzerConfigSchema>;
export type ComplianceConfig = z.infer<typeof ComplianceConfigSchema>;
