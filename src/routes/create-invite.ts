import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { dayjs } from "../lib/dayjs";
import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trip/:tripId/links",
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
        throw new Error("Trip not found");
      }

      const participant = await prisma.participants.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      return {
        participant: participant,
      };
    }
  );
}
