import { Body, Controller, Headers, Post } from '@nestjs/common';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private readonly subscriptions: SubscriptionsService) {}

  @Post('apple')
  apple(
    @Body() body: Record<string, unknown>,
    @Headers('x-apple-notification-type') notificationType?: string,
  ) {
    const eventType =
      notificationType ??
      (body.notification_type as string) ??
      (body.notificationType as string) ??
      'unknown';

    return this.subscriptions.handleWebhookEvent('apple', eventType, body);
  }

  @Post('google')
  google(@Body() body: Record<string, unknown>) {
    const message = body.message as Record<string, unknown> | undefined;
    const data = message?.data as string | undefined;
    let parsed: Record<string, unknown> = body;

    if (data) {
      try {
        parsed = JSON.parse(Buffer.from(data, 'base64').toString('utf8')) as Record<
          string,
          unknown
        >;
      } catch {
        parsed = body;
      }
    }

    const eventType =
      (parsed.subscriptionNotification as Record<string, unknown> | undefined)
        ?.notificationType?.toString() ??
      (parsed.eventType as string) ??
      'unknown';

    return this.subscriptions.handleWebhookEvent('google', eventType, parsed);
  }
}
