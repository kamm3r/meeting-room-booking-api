import * as v from "valibot";

const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export const IsoDateTimeString = v.pipe(
  v.string(),
  v.minLength(1),
  v.regex(isoDateTimeRegex, "Invalid ISO 8601 date-time"),
);

export const CreateBookingRequestSchema = v.object({
  startTime: IsoDateTimeString,
  endTime: IsoDateTimeString,
});

export type CreateBookingRequest = v.InferOutput<
  typeof CreateBookingRequestSchema
>;

export const BookingSchema = v.object({
  id: v.string(),
  roomId: v.string(),
  startTime: IsoDateTimeString,
  endTime: IsoDateTimeString,
  createdAt: IsoDateTimeString,
});

export type Booking = v.InferOutput<typeof BookingSchema>;

export const BookingDeletionResultSchema = v.object({
  id: v.string(),
  deletedAt: IsoDateTimeString,
});

export type BookingDeletionResult = v.InferOutput<
  typeof BookingDeletionResultSchema
>;

export const ErrorResponseSchema = v.object({
  code: v.string(),
  message: v.string(),
});

export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>;
