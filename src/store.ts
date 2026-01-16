import { randomUUID } from "crypto";
import type { BookingDeletionResult } from "./schemas";

export type Booking = {
  id: string;
  roomId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
};

const bookingsByRoom = new Map<string, Booking[]>();

export const bookingStore = {
  list(roomId: string): Booking[] {
    return bookingsByRoom.get(roomId) ?? [];
  },

  create(roomId: string, startTime: string, endTime: string): Booking {
    const booking: Booking = {
      id: randomUUID(),
      roomId,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
    };

    const bookings = bookingsByRoom.get(roomId) ?? [];
    bookings.push(booking);
    bookingsByRoom.set(roomId, bookings);

    return booking;
  },

  delete(roomId: string, bookingId: string): BookingDeletionResult | null {
    const bookings = bookingsByRoom.get(roomId);
    if (!bookings) return null;

    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    bookings.splice(index, 1);

    return {
      id: bookingId,
      deletedAt: new Date().toISOString(),
    };
  },
};
