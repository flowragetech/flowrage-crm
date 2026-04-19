import { z } from 'zod';

export const dealSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  status: z.string(),
  value: z.number(),
  pipelineStage: z.string(),
  customFields: z.record(z.string(), z.unknown()).default({})
});

export type DealRecord = z.infer<typeof dealSchema>;
