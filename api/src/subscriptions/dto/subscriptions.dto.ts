import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class VerifyPurchaseDto {
  @IsIn(['apple', 'google'])
  platform!: 'apple' | 'google';

  @IsString()
  @MaxLength(100)
  productId!: string;

  @IsString()
  @MaxLength(255)
  transactionId!: string;

  @IsOptional()
  @IsString()
  purchaseToken?: string;

  @IsOptional()
  @IsString()
  receiptData?: string;
}

export class WebhookPayloadDto {
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
