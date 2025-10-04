import { z } from 'zod';

import Step1 from '@/pages/RegisterFlow/views/Step1';
import Step3 from '@/pages/RegisterFlow/views/Step3';

/**
 * CIF validation levels system
 * Currently there are 3 levels of validation:
 * Config in code.
 * 1: Check length and pattern
 * 2: Check first letter
 * 3: Check control digit
 */
const CIF_VALIDATE_LEVEL: 1 | 2 | 3 = 1;

const cifSchema = z
  .string()
  .min(1, 'register:required_cif_error')
  .refine((cif) => {
    // Check length and pattern
    if (!/^[A-HJNP-SUV]-?[0-9]{7}[0-9A-J]$/.test(cif)) {
      return false;
    }

    if (CIF_VALIDATE_LEVEL === 1) {
      return true;
    }

    const _cif = cif.replace('-', '');

    // Extract components
    const letter = _cif[0];
    const numbers = _cif.slice(1, 8);
    const controlChar = _cif[8];

    // Allowed first letters for Spanish CIF
    const validFirstLetters = 'A B C D E F G H J N P Q R S U V'.split(' ');
    if (!validFirstLetters.includes(letter)) {
      return false;
    }

    if (CIF_VALIDATE_LEVEL === 2) {
      return true;
    }

    // Compute control digit
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      let num = parseInt(numbers[i]);
      if (i % 2 === 0) {
        let double = num * 2;
        sum += double > 9 ? double - 9 : double;
      } else {
        sum += num;
      }
    }
    const controlDigit = (10 - (sum % 10)) % 10;

    // CIF can have a numeric or alphabetic control character
    if (/[ABEH]/.test(letter)) {
      return controlChar === controlDigit.toString();
    } else if (/[KPQS]/.test(letter)) {
      return controlChar === 'JABCDEFGHI'[controlDigit];
    } else {
      return (
        controlChar === controlDigit.toString() ||
        controlChar === 'JABCDEFGHI'[controlDigit]
      );
    }
  }, 'register:invalid_cif_error');

const registerFormSchemaStep1 = z
  .object({
    first_name: z.string().min(1, 'register:required_first_name_error'),
    last_name: z.string().min(1, 'register:required_last_name_error'),
    email: z.string().email('register:invalid_email'),
    confirm: z.string().min(6, 'register:invalid_password_length'),
    password: z.string().min(6, 'register:invalid_password_length'),
    country_code: z.object({
      code: z.string(),
      label: z.string(),
      value: z.string(),
    }),
    phone: z
      .string()
      .regex(/^[6789]\d{8}$/, 'register:invalid_phone_number')
      .min(9, 'register:phone_number_length')
      .max(9, 'register:phone_number_length'),
  })
  .refine((data) => data.confirm === data.password, {
    message: 'register:confirm_password_incorrect',
    path: ['confirm'],
  });

const websiteRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
const registerFormSchemaStep3 = z.object({
  address: z.string().min(1, 'register:required_address_error'),
  cif: cifSchema,
  legal_name: z.string().min(1, 'register:required_legal_name_error'),
  public_name: z.string().min(1, 'register:required_public_name_error'),
  city_code: z.object({
    value: z.string(),
    label: z.string().min(1, 'register:form_step_3_province_required'),
  }),
  facility_type: z.string({
    required_error: 'register:required_facility-type',
  }),
  other_facility_type_name: z.string().optional(),
  web_page: z
    .string()
    .min(1, 'register:required_web_page_error')
    .regex(websiteRegex, 'register:invalid_web_page_error'),
});

export type RegisterFormData = z.infer<typeof registerFormSchemaStep1> &
  z.infer<typeof registerFormSchemaStep3>;

export type FormStep = {
  index: number;
  nextIndex?: number;
  prevIndex?: number;
  backBehavior?: 'reset' | 'back' | 'navigate-back';
  label: string;
  id: string;
  submitLabel: string;
  component: React.FC;
  schema: z.ZodType<any, any>;
  _arrayIndex: number;
};

export const steps: FormStep[] = [
  {
    _arrayIndex: 0,
    index: 1,
    nextIndex: 3,
    backBehavior: 'navigate-back',
    label: '1',
    id: 'step-1',
    submitLabel: 'register:create_account',
    component: Step1,
    schema: registerFormSchemaStep1,
  },
  // {
  //   index: 2,
  //   label: "2",
  //   id: "step-2",
  //   submitLabel: "Verificar móvil",
  //   component: Step2,
  // },
  {
    _arrayIndex: 1,
    index: 3,
    prevIndex: 1,
    label: '3',
    id: 'step-3',
    submitLabel: 'register:create_facility',
    component: Step3,
    schema: registerFormSchemaStep3,
  },
];
