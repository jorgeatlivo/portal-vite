export enum DisclaimerTypeEnum {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export type DisclaimerDTO = {
  type: DisclaimerTypeEnum;
  message: string;
};
