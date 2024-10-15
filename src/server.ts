import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/trip/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/trip/confirm-trip";
import { confirmParticipant } from "./routes/participant/confirm-participant";
import { createActivity } from "./routes/activity/create-activity";
import { getActivities } from "./routes/activity/get-activities";
import { getParticipants } from "./routes/participant/get-participants";
import { getTripDetails } from "./routes/trip/get-trip-details";
import { createLink } from "./routes/link/create-link";
import { getLinks } from "./routes/link/get.links";
import { createInvite } from "./routes/participant/create-invite";
import { updateTrip } from "./routes/trip/update-trip";
import { getParticipantDetails } from "./routes/participant/get-participant";
import { errorHandler } from "./lib/error-handler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);
app.register(getParticipantDetails);

app.listen({
  port: env.PORT,
});
