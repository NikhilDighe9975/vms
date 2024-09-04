import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends FastifyRequest {
  user?: JwtPayload | string;
}

const verifyToken = async (request: CustomRequest, reply: FastifyReply) => {
  const authHeader = request.headers?.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const API_SECRET = process.env.API_SECRET;

      const decodedUser = jwt.verify(token, API_SECRET as jwt.Secret, {
        algorithms: ["HS256"],
      });

      request.user = decodedUser;
    } catch (error) {
      return reply.status(401).send({
        status: "Failed",
        errorMessage: "Unauthorized - Invalid token",
      });
    }
  } else {
    return reply.status(401).send({
      status: "Failed",
      message: "Unauthorized - Token not found",
    });
  }
};

export default verifyToken;
