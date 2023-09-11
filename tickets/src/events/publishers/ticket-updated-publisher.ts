import { Publisher, Subjects, TicketUpdatedEvent } from '@ewtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}