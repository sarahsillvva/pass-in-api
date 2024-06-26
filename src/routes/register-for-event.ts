import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { promise, z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad_request";

export  async function registerForEvent(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees',{
        schema: {
            summary: 'Register an attendee',
            tags: ['Attendees'],
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),

            }),
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response:{
                201: z.object({
                    attendeedId: z.number(),
                })
            }
        }
    },  async (request, reply) => {
        const { eventId } = request.params
        const { name, email} = request.body

        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email : {
                    email,
                    eventId
                }
            }
        })

        if(attendeeFromEmail !== null){
            throw new BadRequest('Este e-mail já esta registrado neste evento')
        }

        const [event, amoutOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where:{
                    id: eventId
                }
            }),
            prisma.attendee.count({
                where:{
                    eventId
                }
            })
        ])


        if(event?.maximumAttendees  && amoutOfAttendeesForEvent > event?.maximumAttendees ){
            throw new Error('Numero máximo de participantes para o evento, atingido')
        }
        
        const attendeed = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        }) 

        return reply.status(201).send({ attendeedId: attendeed.id})
    })
}