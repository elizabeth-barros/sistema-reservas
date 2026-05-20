import { AvailabilityContext, AvailabilityResult } from './availability-context';

export interface AvailabilityStrategy {
  readonly name: string;
  canHandle(context: AvailabilityContext): boolean;
  validate(context: AvailabilityContext): Promise<AvailabilityResult>;
}
