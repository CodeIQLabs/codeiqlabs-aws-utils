import { z } from 'zod';

/**
 * Aurora Serverless v2 configuration
 *
 * Supports multi-database PostgreSQL clusters for multi-brand applications.
 * Defaults align with the database architecture standard (core + 5 brands).
 */
export const AuroraConfigSchema = z.object({
  /**
   * Enable Aurora provisioning
   */
  enabled: z.boolean().default(false),

  /**
   * Database engine
   * @default aurora-postgresql
   */
  engine: z.literal('aurora-postgresql').default('aurora-postgresql'),

  /**
   * Engine version
   * @default 16.4
   */
  engineVersion: z.string().default('16.4'),

  /**
   * Serverless v2 minimum ACUs
   * @default 0.5
   */
  minCapacity: z.number().min(0.5).max(128).default(0.5),

  /**
   * Serverless v2 maximum ACUs
   * @default 2
   */
  maxCapacity: z.number().min(0.5).max(128).default(2),

  /**
   * Databases to create inside the cluster
   * Supplied by the application manifest (no org-specific defaults)
   */
  databases: z.array(z.string()).default([]),

  /**
   * Backup retention in days
   * @default 7
   */
  backupRetentionDays: z.number().min(1).max(35).default(7),

  /**
   * Deletion protection flag
   * @default true
   */
  deletionProtection: z.boolean().default(true),

  /**
   * Enable Performance Insights
   * @default true
   */
  performanceInsights: z.boolean().default(true),

  /**
   * Performance Insights retention in days
   * @default 7
   */
  performanceInsightsRetention: z.number().min(7).max(731).default(7),
});

export type AuroraConfig = z.infer<typeof AuroraConfigSchema>;
