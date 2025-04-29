export interface SystemSettings {
  moqEnabled: boolean;
  defaultMOQ: number;
  containerTypes: string[];
  alertThresholds: {
    stock: number;
    order: number;
  };
  emailTemplates: {
    orderConfirmation: boolean;
    shipmentUpdate: boolean;
    stockAlert: boolean;
  };
}
