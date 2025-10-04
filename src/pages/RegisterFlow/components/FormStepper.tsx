import { FC } from 'react';

import { Step, StepIconProps, StepLabel, Stepper } from '@mui/material';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import clsx from 'clsx';

import colors from '@/config/color-palette';
import { FormStep, steps } from '@/pages/RegisterFlow/register-form.config';

interface FormStepperProps {
  activeStep: FormStep;
}

const CustomStepIcon: React.FC<StepIconProps> = (props) => {
  const { active, completed, className, icon } = props;

  if (completed) {
    return (
      <IconCircleCheckFilled
        size={32}
        color={colors['Action-Secondary']}
        className={className}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex size-[26.67px] items-center justify-center rounded-full text-s02 font-bold',
        active
          ? 'bg-Action-Secondary text-white'
          : 'bg-Mint-100 text-Action-Secondary'
      )}
    >
      {icon}
    </div>
  );
};

const FormStepper: FC<FormStepperProps> = ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep._arrayIndex} alternativeLabel>
      {steps.map((_step) => (
        <Step key={`step-${_step.id}`}>
          <StepLabel StepIconComponent={CustomStepIcon}>
            {_step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default FormStepper;
