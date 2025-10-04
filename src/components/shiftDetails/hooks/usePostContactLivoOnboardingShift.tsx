import { useMutation } from '@tanstack/react-query';

import { postContactLivoOnboardingShift } from '@/queries/contact-livo';

export function usePostContactLivoOnboardingShift(params?: {
  onSuccess?: (params?: { ok: boolean }) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: contactLivo,
    error,
  } = useMutation({
    mutationFn: postContactLivoOnboardingShift,
    onSuccess: params?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    contactLivo,
  };
}
