import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import * as v from "valibot";
import { bookingStore } from "./store";
import {
  CreateBookingRequestSchema,
  BookingSchema,
  BookingDeletionResultSchema,
  ErrorResponseSchema,
} from "./schemas";

const app = new Hono();

app.get(
  "/:roomId/bookings",
  describeRoute({
    summary: "List bookings for a room",
    responses: {
      200: {
        description: "List of bookings",
        content: {
          "application/json": {
            schema: resolver(v.array(BookingSchema)),
          },
        },
      },
    },
  }),
  (c) => {
    const roomId = c.req.param("roomId");
    return c.json(bookingStore.list(roomId));
  },
);

app.post(
  "/:roomId/bookings",
  describeRoute({
    summary: "Create a booking",
    requestBody: {
      content: {
        "application/json": {
          schema: CreateBookingRequestSchema,
        },
      },
    },
    responses: {
      201: {
        description: "Booking created",
        content: {
          "application/json": {
            schema: resolver(BookingSchema),
          },
        },
      },
      400: {
        description: "Invalid input",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
      409: {
        description: "Booking conflict",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  validator("json", CreateBookingRequestSchema),
  (c) => {
    const roomId = c.req.param("roomId");
    const { startTime, endTime } = c.req.valid("json");

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start >= end) {
      return c.json(
        {
          code: "INVALID_INTERVAL",
          message: "Start time must be before end time",
        },
        400,
      );
    }

    if (start <= now) {
      return c.json(
        {
          code: "PAST_BOOKING",
          message: "Bookings cannot be in the past",
        },
        400,
      );
    }

    const hasOverlap = bookingStore.list(roomId).some((b) => {
      return start < new Date(b.endTime) && end > new Date(b.startTime);
    });

    if (hasOverlap) {
      return c.json(
        {
          code: "BOOKING_CONFLICT",
          message: "Booking overlaps with an existing reservation",
        },
        409,
      );
    }

    const booking = bookingStore.create(
      roomId,
      start.toISOString(),
      end.toISOString(),
    );

    return c.json(booking, 201);
  },
);

app.delete(
  "/:roomId/bookings/:bookingId",
  describeRoute({
    summary: "Cancel a booking",
    responses: {
      200: {
        description: "Booking deleted",
        content: {
          "application/json": {
            schema: resolver(BookingDeletionResultSchema),
          },
        },
      },
      404: {
        description: "Booking not found",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  (c) => {
    const { roomId, bookingId } = c.req.param();
    const result = bookingStore.delete(roomId, bookingId);

    if (!result) {
      return c.json({ code: "NOT_FOUND", message: "Booking not found" }, 404);
    }

    return c.json(result, 200);
  },
);

export default app;
