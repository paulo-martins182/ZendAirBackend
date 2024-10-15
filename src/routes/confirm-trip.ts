import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { TEMPLATE_CONFIRM_MAIL } from "../utils/mail-template";
import nodemailer from "nodemailer";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) {
        throw new Error("Trip not found!");
      }

      if (trip?.is_confirmed) {
        return reply.redirect(`http://localhost:3000/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          is_confirmed: true,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      if (trip.participants.length > 0) {
        await Promise.all([
          trip.participants.map(async (participant) => {
            const confirmationLink = `http://localhost:3000/participants/${participant.id}/confirm`;
            const message = await mail.sendMail({
              from: {
                name: "Equipe ZendAir",
                address: "zendair@suport.com",
              },
              to: participant.email,
              subject: "Confirmação de Viagem",
              html: TEMPLATE_CONFIRM_MAIL({
                destination: trip.destination,
                formattedStartDate,
                formattedEndDate,
                confirmationLink,
              }),
            });
            console.log(
              `mail to ${participant.email}: `,
              nodemailer.getTestMessageUrl(message)
            );
          }),
        ]);
      }

      return reply.redirect(`http://localhost:3000/trips/${tripId}`);
    }
  );
}
