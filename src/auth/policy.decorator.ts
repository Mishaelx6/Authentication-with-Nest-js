import { SetMetadata } from '@nestjs/common';
import { PolicyAction, POLICY_KEY } from './policy.guard';

export const Policy = (action: PolicyAction) => SetMetadata(POLICY_KEY, action);
