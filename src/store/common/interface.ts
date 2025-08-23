export interface RouteProps {
  path: string;
  name?: string;
  component: React.FC;
  middleware?: any;
}

export interface ObjAny {
  [key: string]: any;
}

export interface FilterDefaultModel {
  action: string;
  payload: {
    page: number;
    pageSize: number;
    [x: string]: string | number;
  };
}

export interface ModalAction {
  isShow: boolean;
  data?: ObjAny;
}

export interface OptionSelect {
  value: string;
  label: string;
}
