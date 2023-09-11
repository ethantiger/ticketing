import { Subjects, Publisher, ExpirationCompleteEvent } from "@ewtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}