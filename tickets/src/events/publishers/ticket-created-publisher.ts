import { Publisher, Subjects, TicketCreatedEvent } from '@ewtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}