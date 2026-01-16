import { Hono } from 'hono'
	import { safeParse } from 'valibot'
	import { bookingStore } from './store'
	import {
	  CreateBookingRequestSchema,
	  type ErrorResponse,
	} from './schemas'
	
	const app = new Hono()
	
	app.get('/:roomId/bookings', (c) => {
	  const roomId = c.req.param('roomId')
	  const bookings = bookingStore.list(roomId)
	
	  return c.json(bookings)
	})
	
	app.post('/:roomId/bookings', async (c) => {
	  const roomId = c.req.param('roomId')
	  const json = await c.req.json<unknown>()
	
	  const parsed = safeParse(CreateBookingRequestSchema, json)
	
	  if (!parsed.success) {
	    const error: ErrorResponse = {
	      code: 'VALIDATION_ERROR',
	      message: 'Invalid request body',
	    }
	
	    return c.json(error, 400)
	  }
	
	  const { startTime, endTime } = parsed.output
	
	  const start = new Date(startTime)
	  const end = new Date(endTime)
	  const now = new Date()
	
	  if (start >= end) {
	    return c.json(
	      {
	        code: 'INVALID_INTERVAL',
	        message: 'Start time must be before end time',
	      },
	      400
	    )
	  }
	
	  if (start <= now) {
	    return c.json(
	      {
	        code: 'PAST_BOOKING',
	        message: 'Bookings cannot be in the past',
	      },
	      400
	    )
	  }
	
	  const existing = bookingStore.list(roomId)
	
	  const hasOverlap = existing.some((b) => {
	    const existingStart = new Date(b.startTime)
	    const existingEnd = new Date(b.endTime)
	
	    return start < existingEnd && end > existingStart
	  })
	
	  if (hasOverlap) {
	    return c.json(
	      {
	        code: 'BOOKING_CONFLICT',
	        message: 'Booking overlaps with an existing reservation',
	      },
	      409
	    )
	  }
	
	  const booking = bookingStore.create(
	    roomId,
	    start.toISOString(),
	    end.toISOString()
	  )
	
	  return c.json(booking, 201)
	})
	
	app.delete('/:roomId/bookings/:bookingId', (c) => {
	  const roomId = c.req.param('roomId')
	  const bookingId = c.req.param('bookingId')
	
	  const result = bookingStore.delete(roomId, bookingId)
	
	  if (!result) {
	    return c.json(
	      { code: 'NOT_FOUND', message: 'Booking not found' },
	      404
	    )
	  }
	
	  return c.json(result, 200)
	})
	
	export default app