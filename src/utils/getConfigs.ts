import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";

export const getConfigs = (): ConfigModuleOptions => {
  const filePathPrefix = "./configs";
  let envFilePath = "";
  if (process.env.NODE_ENV) {
    envFilePath = `${filePathPrefix}/.${process.env.NODE_ENV}.env`;
  } else {
    envFilePath = `${filePathPrefix}/.env`;
  }
  return {
    isGlobal: true,
    envFilePath,
  };
};
