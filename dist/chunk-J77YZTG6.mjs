import {
  BadRequest
} from "./chunk-5QBEOMCR.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-events.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/events/:eventId", {
    schema: {
      summary: "Get an event",
      tags: ["Event"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
          event: z.object({
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendess: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: { select: {
          attendees: true
        } }
      },
      where: {
        id: eventId
      }
    });
    if (event == null) {
      throw new BadRequest("Evento n\xE3o encontrado.");
    }
    return reply.status(200).send({ event: {
      title: event.title,
      slug: event.slug,
      details: event.details,
      maximumAttendess: event.maximumAttendees,
      attendeesAmount: event._count.attendees
    } });
  });
}

export {
  getEvent
};
