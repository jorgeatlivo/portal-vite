import { FLAGS } from '@/config/flag-enums';

class FlagsService {
  static getFlag(flagName: FLAGS) {
    const value = localStorage.getItem(flagName);

    if (value === 'true' || value === 'false') {
      return value === 'true';
    }

    return null;
  }

  static setFlag(flagName: FLAGS, value: boolean) {
    localStorage.setItem(flagName, value.toString());
  }

  static removeFlag(flagName: FLAGS) {
    localStorage.removeItem(flagName);
  }

  static clearAllFlags() {
    for (const key in FLAGS) {
      localStorage.removeItem(key);
    }
  }
}

export default FlagsService;
