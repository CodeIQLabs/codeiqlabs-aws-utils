import { z } from 'zod';
import {
  BooleanSchema,
  ConfigModeSchema,
  NameSchema,
  DescriptionSchema,
  TagsSchema,
  AwsRegionSchema,
} from '../base';

/**
 * Networking configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for AWS networking resources
 * including VPCs, subnets, routing, gateways, and network security configurations.
 */

/**
 * CIDR block validation for VPCs and subnets
 */
export const CidrBlockSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/,
    'Invalid CIDR block format (expected: 10.0.0.0/16)',
  );

/**
 * Availability Zone validation
 */
export const AvailabilityZoneSchema = z
  .string()
  .regex(/^[a-z]{2}-[a-z]+-\d+[a-z]$/, 'Invalid Availability Zone format (expected: us-east-1a)');

/**
 * Subnet type enumeration
 */
export const SubnetTypeSchema = z.enum(['public', 'private', 'isolated']);

/**
 * Route destination types
 */
export const RouteDestinationSchema = z.union([
  z.object({
    type: z.literal('cidr'),
    cidr: CidrBlockSchema,
  }),
  z.object({
    type: z.literal('prefix-list'),
    prefixListId: z.string().regex(/^pl-[a-z0-9]+$/, 'Invalid prefix list ID'),
  }),
]);

/**
 * Route target types
 */
export const RouteTargetSchema = z.union([
  z.object({
    type: z.literal('internet-gateway'),
    gatewayId: z
      .string()
      .regex(/^igw-[a-z0-9]+$/, 'Invalid Internet Gateway ID')
      .optional(),
  }),
  z.object({
    type: z.literal('nat-gateway'),
    gatewayId: z
      .string()
      .regex(/^nat-[a-z0-9]+$/, 'Invalid NAT Gateway ID')
      .optional(),
  }),
  z.object({
    type: z.literal('vpc-endpoint'),
    endpointId: z
      .string()
      .regex(/^vpce-[a-z0-9]+$/, 'Invalid VPC Endpoint ID')
      .optional(),
  }),
  z.object({
    type: z.literal('transit-gateway'),
    gatewayId: z
      .string()
      .regex(/^tgw-[a-z0-9]+$/, 'Invalid Transit Gateway ID')
      .optional(),
  }),
  z.object({
    type: z.literal('vpc-peering'),
    connectionId: z
      .string()
      .regex(/^pcx-[a-z0-9]+$/, 'Invalid VPC Peering Connection ID')
      .optional(),
  }),
]);

/**
 * Individual subnet configuration
 */
export const SubnetConfigSchema = z.object({
  name: NameSchema,
  type: SubnetTypeSchema,
  cidr: CidrBlockSchema,
  availabilityZone: AvailabilityZoneSchema,
  mapPublicIpOnLaunch: BooleanSchema.optional().default(false),
  tags: TagsSchema,
});

/**
 * Route table route configuration
 */
export const RouteConfigSchema = z.object({
  destination: RouteDestinationSchema,
  target: RouteTargetSchema,
  description: DescriptionSchema.optional(),
});

/**
 * Route table configuration
 */
export const RouteTableConfigSchema = z.object({
  name: NameSchema,
  routes: z.array(RouteConfigSchema).optional(),
  subnetAssociations: z.array(NameSchema).optional(), // References subnet names
  tags: TagsSchema,
});

/**
 * NAT Gateway configuration
 */
export const NatGatewayConfigSchema = z.object({
  name: NameSchema,
  subnetName: NameSchema, // Reference to public subnet
  allocationId: z
    .string()
    .regex(/^eipalloc-[a-z0-9]+$/, 'Invalid Allocation ID')
    .optional(),
  connectivityType: z.enum(['public', 'private']).default('public'),
  tags: TagsSchema,
});

/**
 * Internet Gateway configuration
 */
export const InternetGatewayConfigSchema = z.object({
  name: NameSchema,
  tags: TagsSchema,
});

/**
 * VPC Endpoint service names for common AWS services
 */
export const VpcEndpointServiceSchema = z.enum([
  's3',
  'dynamodb',
  'ec2',
  'ssm',
  'ssmmessages',
  'ec2messages',
  'kms',
  'logs',
  'monitoring',
  'events',
  'secretsmanager',
  'lambda',
  'sts',
  'elasticloadbalancing',
]);

/**
 * VPC Endpoint configuration
 */
export const VpcEndpointConfigSchema = z.object({
  name: NameSchema,
  service: z.union([VpcEndpointServiceSchema, z.string()]), // Predefined or custom service
  type: z.enum(['Gateway', 'Interface']),
  subnetNames: z.array(NameSchema).optional(), // For Interface endpoints
  routeTableNames: z.array(NameSchema).optional(), // For Gateway endpoints
  policyDocument: z.record(z.any()).optional(), // IAM policy document
  privateDnsEnabled: BooleanSchema.optional().default(true),
  tags: TagsSchema,
});

/**
 * VPC Flow Logs configuration
 */
export const VpcFlowLogsConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  destination: z.enum(['cloudwatch', 's3']).default('cloudwatch'),
  logFormat: z.string().optional(),
  logGroup: NameSchema.optional(), // For CloudWatch destination
  s3Bucket: NameSchema.optional(), // For S3 destination
  trafficType: z.enum(['ALL', 'ACCEPT', 'REJECT']).default('ALL'),
  tags: TagsSchema,
});

/**
 * Complete VPC configuration schema
 */
export const VpcConfigSchema = z.object({
  name: NameSchema,
  cidr: CidrBlockSchema,
  region: AwsRegionSchema,
  enableDnsHostnames: BooleanSchema.default(true),
  enableDnsSupport: BooleanSchema.default(true),
  subnets: z.array(SubnetConfigSchema).min(1, 'At least one subnet is required'),
  routeTables: z.array(RouteTableConfigSchema).optional(),
  natGateways: z.array(NatGatewayConfigSchema).optional(),
  internetGateway: InternetGatewayConfigSchema.optional(),
  vpcEndpoints: z.array(VpcEndpointConfigSchema).optional(),
  flowLogs: VpcFlowLogsConfigSchema.optional(),
  tags: TagsSchema,
});

/**
 * Complete networking configuration schema
 */
export const NetworkingConfigSchema = z.object({
  mode: ConfigModeSchema.default('create'),
  vpc: VpcConfigSchema,
});

// Export types for TypeScript usage
export type CidrBlock = z.infer<typeof CidrBlockSchema>;
export type AvailabilityZone = z.infer<typeof AvailabilityZoneSchema>;
export type SubnetType = z.infer<typeof SubnetTypeSchema>;
export type RouteDestination = z.infer<typeof RouteDestinationSchema>;
export type RouteTarget = z.infer<typeof RouteTargetSchema>;
export type SubnetConfig = z.infer<typeof SubnetConfigSchema>;
export type RouteConfig = z.infer<typeof RouteConfigSchema>;
export type RouteTableConfig = z.infer<typeof RouteTableConfigSchema>;
export type NatGatewayConfig = z.infer<typeof NatGatewayConfigSchema>;
export type InternetGatewayConfig = z.infer<typeof InternetGatewayConfigSchema>;
export type VpcEndpointService = z.infer<typeof VpcEndpointServiceSchema>;
export type VpcEndpointConfig = z.infer<typeof VpcEndpointConfigSchema>;
export type VpcFlowLogsConfig = z.infer<typeof VpcFlowLogsConfigSchema>;
export type VpcConfig = z.infer<typeof VpcConfigSchema>;
export type NetworkingConfig = z.infer<typeof NetworkingConfigSchema>;
