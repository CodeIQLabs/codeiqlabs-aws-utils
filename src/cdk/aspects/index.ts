import { Tags } from 'aws-cdk-lib';
import type * as cdk from 'aws-cdk-lib';

export function applyGlobalAspects(app: cdk.App, tags?: Record<string, string>): void {
  if (!tags || !Object.keys(tags).length) return;
  Object.entries(tags).forEach(([k, v]) => Tags.of(app).add(k, v));
}
