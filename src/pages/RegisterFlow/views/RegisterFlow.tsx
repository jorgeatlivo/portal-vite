import clsx from 'clsx';

import RegisterForm from '@/pages/RegisterFlow/views/RegisterForm';
import styles from './register-flow.module.scss';

export default function RegisterFlow() {
  return (
    <div
      className={clsx(
        'relative flex flex-col items-center bg-Secondary-900 xxs:!h-auto md:min-h-screen md:flex-1 md:justify-between md:overflow-hidden',
        styles.landing_background
      )}
    >
      <div className="flex h-screen w-full items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
