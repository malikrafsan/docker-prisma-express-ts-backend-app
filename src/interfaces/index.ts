export interface IParamsAPI {
  params?: Object;
  url: string;
  withoutCredentials?: boolean;
  mock?: {
    err: any;
    data: any;
  };
  withoutNotif?: boolean;
  onError?: (props: any) => void;
  onSuccess?: (props: any) => void;
}
