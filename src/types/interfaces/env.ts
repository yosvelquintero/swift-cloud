export interface IEnv {
  app: {
    api: {
      name: string;
      version: string;
      host: string;
      port: string;
      isSwaggerEnabled: string;
      prefix: string;
      swagger: {
        description: string;
        prefix: string;
      };
    };
  };
  database: {
    mongodb: {
      mongodbHost: string;
      mongodbDb: string;
      mongodbUser: string;
      mongodbPort: string;
      mongodbPassword: string;
      mongodbUri: string;
    };
  };
}
