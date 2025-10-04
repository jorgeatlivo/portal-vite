import { ClaimRequest } from '@/types/claims';

import { api, handleApiError } from './api';

export function fetchClaimInfo(
  shiftId: number,
  shiftClaimId: number
): Promise<ClaimRequest> {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}`;
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export function shiftClaimAccept(
  shiftId: number,
  shiftClaimId: number,
  reason?: string,
  comment?: string,
  skipConstraints?: boolean
) {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/accept${skipConstraints ? '?skipConstraints=true' : ''}`;

  return api
    .post(
      uri,
      reason ? { slotReason: reason, slotReasonComment: comment } : null
    )
    .then((res) => res.data);
}

export function shiftClaimReject(
  shiftId: number,
  shiftClaimId: number,
  rejectReason: string,
  reasonDetail: string,
  skipConstraints?: boolean
): Promise<boolean | void> {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/reject-claim${skipConstraints ? '?skipConstraints=true' : ''}`;
  const body = {
    reason: rejectReason,
    reasonDetail,
  };

  return api.post(uri, body).then((res) => res.status === 200);
}

export function fetchShiftClaimRejectReasons() {
  const uri = '/facility/common/shift-claim-reject-reasons';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export function shiftCancellationResolve(
  shiftId: number,
  shiftClaimId: number
) {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/resolve-cancellation`;

  return api
    .post(uri, null)
    .then((res) => res.data)
    .catch(handleApiError);
}

export function shiftCancellationAccept(
  shiftId: number,
  shiftClaimId: number,
  skipConstraints?: boolean
) {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/accept-cancellation${skipConstraints ? '?skipConstraints=true' : ''}`;

  return api.post(uri, null).then((res) => res.data);
}

export function updateClaimSlotReason(
  shiftId: number,
  shiftClaimId: number,
  reason: string,
  comment: string
) {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/update-reason`;

  return api
    .post(uri, {
      slotReason: reason,
      slotReasonComment: comment,
    })
    .then((res) => res.data)
    .catch(handleApiError);
}
export function deleteClaimRequest(
  shiftId: number,
  shiftClaimId: number,
  reason: string,
  skipConstraints?: boolean
) {
  const uri = `/facility/portal/shifts/${shiftId}/claims/${shiftClaimId}/cancel-approved-claim${skipConstraints ? '?skipConstraints=true' : ''}`;
  const body = { reason };
  return api.post(uri, body).then((res) => res.data);
}
