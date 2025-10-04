import { useMutation } from '@tanstack/react-query';

import { mutateAcceptClaim } from '@/queries/shift-mutation';

export function useMutateClaims(params?: {
  onSuccess: (params?: { ok: boolean }) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: acceptClaim,
    mutateAsync: acceptClaimAsync,
    error,
  } = useMutation({
    mutationFn: mutateAcceptClaim,
    onSuccess: params?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    acceptClaim,
    acceptClaimAsync,
  };
}
