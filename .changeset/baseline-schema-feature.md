---
"@codeiqlabs/aws-utils": minor
---

Add baseline application schema for foundational infrastructure

This release introduces a new fourth application schema type for CodeIQLabs AWS projects:

**New Features:**
- **BaselineAppConfigSchema**: Complete foundational infrastructure configuration for workload accounts
- **NetworkingConfigSchema**: Comprehensive VPC, subnet, routing, and gateway configurations
- **SecurityConfigSchema**: Security groups, NACLs, IAM roles, KMS keys, and Session Manager setup
- **ComplianceConfigSchema**: CloudTrail, Config, GuardDuty, Security Hub, Inspector, and Access Analyzer

**Schema Architecture:**
The CodeIQLabs configuration system now supports four application types:
1. `management` - AWS Organizations, Identity Center, cross-account management
2. `shared-services` - Centralized services (monitoring, Transit Gateway)
3. `workload` - Application-specific infrastructure deployment
4. `baseline` - Foundational infrastructure (VPC, security, compliance) ✨ **NEW**

**Deployment Sequence:**
```
1. Management Account → ManagementAppConfigSchema
2. Shared Services Account → SharedServicesAppConfigSchema  
3. Workload Accounts → BaselineAppConfigSchema (first)
4. Workload Accounts → WorkloadAppConfigSchema (second)
```

**Key Benefits:**
- Consistent networking and security foundations across all workload accounts
- Comprehensive compliance and monitoring setup out of the box
- Type-safe configuration with full TypeScript support and IntelliSense
- Modular design allows customization while maintaining standards

**Breaking Changes:** None - this is a purely additive feature

**JSON Schema Support:**
- New `baseline-manifest.schema.json` for IntelliSense support
- Updated `manifest.schema.json` to include baseline configuration type
- All existing schemas remain unchanged and fully compatible
