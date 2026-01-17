import { z } from 'zod';

/**
 * DynamoDB table configuration
 *
 * Supports single-table design pattern for multi-brand applications.
 * Tables use on-demand billing for cost efficiency at low scale.
 */
export const DynamoDBConfigSchema = z.object({
  /**
   * Table names to create (e.g., ['core', 'savvue', 'equitrio'])
   * Each table follows single-table design with PK/SK and GSIs
   */
  tables: z.array(z.string()).default([]),

  /**
   * Enable point-in-time recovery
   * @default true
   */
  pointInTimeRecovery: z.boolean().default(true),

  /**
   * Enable deletion protection
   * @default true for prod, false for nprd
   */
  deletionProtection: z.boolean().optional(),

  /**
   * Billing mode
   * @default PAY_PER_REQUEST (on-demand)
   */
  billingMode: z.enum(['PAY_PER_REQUEST', 'PROVISIONED']).default('PAY_PER_REQUEST'),

  /**
   * Provisioned read capacity units (only used if billingMode is PROVISIONED)
   * @default 5
   */
  readCapacityUnits: z.number().min(1).optional(),

  /**
   * Provisioned write capacity units (only used if billingMode is PROVISIONED)
   * @default 5
   */
  writeCapacityUnits: z.number().min(1).optional(),
});

export type DynamoDBConfig = z.infer<typeof DynamoDBConfigSchema>;
