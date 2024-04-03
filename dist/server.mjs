import {
  registerForEvent
} from "./chunk-UFVS2W6K.mjs";
import {
  errorHandler
} from "./chunk-SQ2P6VAE.mjs";
import {
  checkIn
} from "./chunk-4M5HYDTN.mjs";
import {
  createEvent
} from "./chunk-BP2MMNWI.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-JFVXQIXG.mjs";
import {
  getEventAttendees
} from "./chunk-OU2XUBMC.mjs";
import {
  getEvent
} from "./chunk-J77YZTG6.mjs";
import "./chunk-5QBEOMCR.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["aplication/json"],
    produces: ["aplication/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running!");
});
