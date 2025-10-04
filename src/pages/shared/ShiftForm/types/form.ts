import { BaseOption } from '@/components/form/FormSearchableAutocomplete';

import { ShiftInvitationProfessional } from '@/types/shift-invitation';

export interface ProfessionalOption extends BaseOption {
  value: number;
  label: string;
  locked?: boolean;
  lockedReason?: string;
  original: ShiftInvitationProfessional;
}
