import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class GetPaginatedListValidationSchema {
  @IsString()
  @IsOptional()
  search?: string = "";

  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNumber({}, { message: "Not valid page argument" })
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @Min(10)
  @IsNumber({}, { message: "Not valid limit argument" })
  @IsOptional()
  limit: number = 10;
}
