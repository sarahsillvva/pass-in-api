import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad_request";


export async function getEvent (app: FastifyInstance){


    app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
        schema: {
            summary: 'Get an event',
            tags: ['Event'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    event: z.object({
                        title: z.string(),
                        slug:  z.string(),
                        details:  z.string().nullable(),
                        maximumAttendess: z.number().int().nullable(),
                        attendeesAmount: z.number().int()
                    })
                })
            }
        }
    },async  (request, reply)=>{
        
        const { eventId } = request.params
    
        const event = await prisma.event.findUnique({
            select:{
                title: true,
                slug: true,
                details: true,
                maximumAttendees: true,
                _count: {select:{
                    attendees: true
                }}
            },
            where:{
                id: eventId
            } 
        })

        if( event == null ){
            throw new BadRequest ("Evento não encontrado.")
        }

        return reply.status(200).send({ event: {
            title: event.title,
            slug: event.slug,
            details: event.details,
            maximumAttendess: event.maximumAttendees,
            attendeesAmount: event._count.attendees
        } })
    })
}