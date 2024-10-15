import type { FastifyInstance } from "fastify";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error.validationContext === "params" && error.validation) {
    const formattedErrors = error.validation.map((err) => {
      return {
        parameter: err.instancePath.replace(/^\//, ""),
        message: err.message,
      };
    });

    return reply.status(400).send({
      message: "Invalid parameters",
      errors: formattedErrors,
    });
  }

  if (error.validationContext === "body" && error.validation) {
    const formattedErrors = error.validation.map((err) => {
      return {
        parameter: err.instancePath.replace(/^\//, ""),
        message: err.message,
      };
    });

    return reply.status(400).send({
      message: "Invalid input",
      errors: formattedErrors,
    });
  }

  reply.status(500).send({ message: "Internal server error" });
};
