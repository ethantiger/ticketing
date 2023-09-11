import { Publisher, OrderCancelledEvent, Subjects } from "@ewtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

