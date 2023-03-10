import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";

export const getConfigs = (): ConfigModuleOptions => {
  let envFilePath = "";
  if (process.env.NODE_ENV) {
    envFilePath = `.${process.env.NODE_ENV}.env`;
  } else {
    envFilePath = ".env";
  }
  return {
    isGlobal: true,
    envFilePath,
  };
};
