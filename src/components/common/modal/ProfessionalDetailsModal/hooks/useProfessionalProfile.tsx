import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import {
  PROFESSIONAL_PROFILE_QUERY_KEY,
  queryFnProfessionalProfile,
} from '@/queries/professional-search';

export function useProfessionalProfile(professionalId: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [PROFESSIONAL_PROFILE_QUERY_KEY, professionalId],
    networkMode: 'online',
    refetchOnWindowFocus: false,
    staleTime: TIME['5_minutes'],
    gcTime: TIME['10_minutes'],
    queryFn: queryFnProfessionalProfile,
    enabled: !!professionalId,
  });

  return {
    professionalProfile: data,
    isLoading,
    error,
  };
}
