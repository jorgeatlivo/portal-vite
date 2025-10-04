import { useEffect, useRef, useState } from 'react';

import { TextField } from '@mui/material';

import colors from '@/config/color-palette';

function Step2({ onVerify = () => {} }: { onVerify?: (otp: string) => void }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-[500px] w-full flex-col items-center gap-4">
      <div className="w-full">
        <h3 className="mt-4 text-center text-lg font-bold">
          Verifica tu móvil
        </h3>
        <div className="h-5" />
        <p className="mb-4 self-start text-start text-sm text-gray-600">
          Introduce los 4 dígitos del mensaje que te hemos enviado
        </p>
        <div className="h-5" />
      </div>

      {/* OTP Inputs */}
      <div className="mb-4 flex w-full justify-between gap-4">
        {otp.map((value, index) => (
          <TextField
            key={`register-otp-${index}`}
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) =>
              handleKeyUp(e as React.KeyboardEvent<HTMLInputElement>, index)
            }
            inputRef={(el) => (inputRefs.current[index] = el)}
            variant="outlined"
            placeholder="-"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '40px',
                color: colors['Text-Secondary'],
                padding: '10px',
                borderRadius: '8px',
                width: '120px',
                height: '120px',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
        ))}
      </div>

      <p className="mb-2 self-start !text-start text-xs text-gray-500">
        Si no has recibido un código, recibe otro pulsando{' '}
        <a href="#" className="text-Primary-500">
          aquí
        </a>
      </p>
      <p className="self-start !text-start text-xs text-gray-500">
        {/* countdown */}
        {String(Math.floor(countdown / 60)).padStart(2, '0')}:
        {String(countdown % 60).padStart(2, '0') + ' segundos para'}
      </p>
    </div>
  );
}

export default Step2;
