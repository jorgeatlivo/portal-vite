import { useSearchParam } from '@/hooks/use-search-params';

export function useAction(action: string) {
  const _action = useSearchParam('action');

  return {
    active: !!_action && _action === action,
  };
}
