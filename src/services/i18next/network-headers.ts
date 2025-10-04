import { APIService } from '@/services/api.service';

export function updateNetworksLocale(locale: string) {
  const networkInstances = APIService.getAllInstances();
  networkInstances.forEach((instance) => {
    instance.updateConfig({
      locale: locale,
    });
  });
}
