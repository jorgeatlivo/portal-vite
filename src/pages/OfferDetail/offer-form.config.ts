import { ZodIssueCode, z } from 'zod';

import {
  ContractDurationType,
  DurationTypeCast,
  StartDateType,
  StartDateTypeCast,
} from '@/types/offers';

const zodDurations = Object.values(ContractDurationType) as [
  DurationTypeCast,
  ...DurationTypeCast[],
];

const zodStartDates = Object.values(StartDateType) as [
  StartDateTypeCast,
  ...StartDateTypeCast[],
];

export const offerFormSchema = (hasUnits: boolean) =>
  z
    .object({
      facilityId: z.number().optional(),
      category: z
        .object({
          label: z.string(),
          value: z.string().min(1, 'offers:category_required'),
        })
        .nullable()
        .refine((check) => check !== null, 'offers:category_required'),
      contractType: z.string().nonempty('offers:contract_type_required'),
      startDateType: z
        .enum([...zodStartDates, ''])
        .refine((check) => check !== '', 'offers:start_date_type_required'),
      startDate: z.string().optional(),
      durationType: z.enum([...zodDurations, '']),
      duration: z.string().optional(),
      schedule: z
        .array(z.string(), {
          required_error: 'offers:schedule_required',
        })
        .refine((check) => check.length > 0, 'offers:schedule_required'),
      scheduleDetails: z.string().optional(),
      livoUnit: z.string().optional(),
      professionalField: z.string().optional(),
      salaryMin: z
        .string()
        .nonempty('offers:salary_min_required')
        .regex(/^[0-9,.]*$/, 'offers:salary_min_invalid'),
      salaryMax: z
        .string()
        .regex(/^[0-9,.]*$/, 'offers:salary_max_invalid')
        .optional(),
      salaryPeriod: z.string().nonempty('offers:salary_period_required'),
      salaryDetails: z.string().optional(),
      perks: z.array(z.string()),
      additionalRequirements: z.string().optional(),
      no_experience: z.boolean().optional(),
      requirements: z.array(
        z.object({
          livoUnit: z.string().optional(),
          professionalField: z.string().optional(),
          experience: z.string(),
        })
      ),
      details: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.startDateType === 'SPECIFIC_DATE') {
          return !!data.startDate; // required when startDateType is SPECIFIC_DATE
        }
        return true;
      },
      {
        message: 'offers:start_date_required',
        path: ['startDate'],
      }
    )
    .refine(
      (data) => {
        if (data.durationType === 'SPECIFIC_DATE') {
          return !!data.duration; // required when durationType is SPECIFIC_DATE
        }
        return true;
      },
      {
        message: 'offers:duration_date_required',
        path: ['duration'],
      }
    )
    .refine(
      (data) => {
        // salaryMax should be greater or equal than salaryMin
        if (data.salaryMax && data.salaryMin) {
          return parseFloat(data.salaryMax) >= parseFloat(data.salaryMin);
        }
        return true;
      },
      {
        message: 'offers:salary_max_should_be_greater_or_equal',
        path: ['salaryMax'],
      }
    )
    .superRefine((data, ctx) => {
      if (!(hasUnits && data.livoUnit) && !data.professionalField) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['livoUnit'],
          message: 'offers:unit_or_professional_field_required',
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['professionalField'],
          message: hasUnits
            ? 'offers:unit_or_professional_field_required'
            : 'offers:professional_field_required',
        });
      }
    })
    .superRefine((data, ctrl) => {
      if (data.requirements.length === 0) return;
      const invalidReqIndex = data.requirements.findIndex(
        (req) => req.experience && !req.livoUnit && !req.professionalField
      );
      if (invalidReqIndex !== -1) {
        ctrl.addIssue({
          message: 'offers:missing_requirement_data',
          path: [`requirements.${invalidReqIndex}.professionalField"`],
          code: ZodIssueCode.custom,
        });
        hasUnits &&
          ctrl.addIssue({
            message: 'offers:missing_requirement_data',
            path: [`requirements.${invalidReqIndex}.livoUnit"`],
            code: ZodIssueCode.custom,
          });
      }
    });

/**
 * TODO: There some cycle in dependencies here.
 * OfferFormData currently is a module inside pages, a View layer.
 * But it exported type used as services, a Domain layer.
 * This is a bad practice, and should be avoided.
 * This should be moved to a shared layer, or a domain layer.
 * In future, thinking about new modules called validators or schemas to independent schema from the view.
 * Also, translations should be moved outside view
 */
export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;
