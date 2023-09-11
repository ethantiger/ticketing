import { useEffect, useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/use-request"
import Router from 'next/router'

const OrderShow = ({order, currentUser}) => {
  const [timeLeft, setTimeLeft] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })
  

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft,1000)
    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout 
      token={({id})=> doRequest({token: id})} 
      stripeKey="pk_test_51NobZsI0XqF9L8qy8MXlPvDBbNjV9pQ4yJtB6CuelVGIVfRQJwOnuBUD2ixU6lAbC5xGd7R9Vnbvcfu0RKpEKYoT0085fB6ATU"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data}
}

export default OrderShow