import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { dayjs } from "../../lib/dayjs";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { getMailClient } from "../../lib/mail";
import { TEMPLATE_CONFIRM_MAIL } from "../../utils/mail-template";
import { ClientError } from "../../errors/client-error";
import { env } from "../../env";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trip/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      const participant = await prisma.participants.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

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

      return {
        participant,
      };
    }
  );
}
