
export class Notification {

  partner_key: string;
  message: Message;
  delivery_channels: DeliveryChannel[] = [];

}

export class Message{
  text: string;
}

export class DeliveryChannel{
  type: string;
  to_identifier: string;
  status: string;
}
