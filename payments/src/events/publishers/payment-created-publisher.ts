import { Subjects, Publisher, PaymentCreatedEvent } from '@ewtickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}