import * as React from 'react';

export interface Step {
  id: number;
  name: string;
  fields?: string[];
}

declare const ProgressStepper: React.FC<{
  steps: Step[];
  currentStep: number;
}>;

export default ProgressStepper;
