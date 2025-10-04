import { useMutation } from '@tanstack/react-query';

import { postContactLivo } from '@/queries/contact-livo';

export function useContactLivo(params?: {
  onSuccess?: (params?: { ok: boolean }) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: contactLivo,
    error,
  } = useMutation({
    mutationFn: postContactLivo,
    onSuccess: params?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    contactLivo,
  };
}
