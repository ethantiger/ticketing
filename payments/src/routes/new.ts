import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { stripe } from '../stripe'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@ewtickets/common'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ], validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    // Order does not exist
    if (!order) {
      throw new NotFoundError()
    }
    // Order was not made by the same user logged in
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    // Order is cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order")
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    })
    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })

    res.status(201).send({id: payment.id})
})

export { router as createChargeRouter }