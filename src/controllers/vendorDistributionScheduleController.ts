import { FastifyRequest, FastifyReply } from "fastify";
import vendorDistributionScheduleModel from "../models/vendorDistributionScheduleModel";
import { vendorDistributionSchedule } from "../interfaces/vendorDistributionScheduleInterface"
import generateCustomUUID from "../utility/genrateTraceId";
import { baseSearch } from "../utility/baseService";

export const createVendorDistributionSchedule = async (
    request: FastifyRequest<{ Params: { program_id: string } }>,
    reply: FastifyReply
) => {
    const vendorDistributionScheduleData = request.body as vendorDistributionSchedule;
    const { program_id } = request.params;

    try {
        const newVendorSchedule : any = await vendorDistributionScheduleModel.create({
            ...vendorDistributionScheduleData,
            program_id,
        });

        reply.status(201).send({
            status_code: 201,
            message: "Vendor Distribution Schedule created successfully.",
            id: newVendorSchedule.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "Internal Server Error.",
            trace_id: generateCustomUUID(),
            error,
        });
    }
};


export async function getAllVendorDistributionSchedule(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ["program_id", "name", "is_enabled", "description", "status"]
    const responseFields = ["id", "name", "is_enabled", "modified_on", "description", "status"]
    return baseSearch(request, reply, vendorDistributionScheduleModel, searchFields, responseFields)
}


export const getVendorDistributionScheduleById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { program_id, id } = request.params as { id: string, program_id: string };
    try {
        const VendorSchedule = await vendorDistributionScheduleModel.findOne({
            where: { program_id, id, is_deleted: false },
        });
        if (VendorSchedule) {
            reply.status(200).send({
                status_code: 200,
                data: VendorSchedule,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                vendor_schedule: [],
                massage:"Vendor Distribution Schedule not found."
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "Internal Server Error.",
            trace_id: generateCustomUUID(),
            error,
        });
    }
};

export const deleteVendorDistributionSchedule = async (
    request: FastifyRequest<{ Params: { id: string; program_id: string } }>, reply: FastifyReply) => {
    try {
      const { id, program_id } = request.params;
      const [vendorSchedule] = await vendorDistributionScheduleModel.update(
        {
          is_deleted: true,
          is_enabled: false,
          modified_on: Date.now(),
        },
        { where: { id, program_id, is_deleted: false } }
      );
  
      if (vendorSchedule > 0) {
        reply.status(200).send({
          status_code: 200,
          message: "Vendor Distribution Schedule deleted successfully.",
          trace_id: generateCustomUUID(),
          vendor_schedule: vendorSchedule,
        });
      } else {
        reply.status(200).send({
          status_code: 200,
          message: "Vendor Distribution Schedule not found.",
          trace_id: generateCustomUUID(),
          vendor_schedule: [],
        });
      }
    } catch (error) {
      console.error("Error deleting Vendor Distribution Schedule:", error);
      reply.status(500).send({
        status_code: 500,
        message: "Internal Server Error.",
        trace_id: generateCustomUUID(),
        error,
      });
    }
  };
  
export const updatevendorDistributionSchedule = async (
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) => {
    const { program_id, id } = request.params;

    try {
        const [updatedCount] = await vendorDistributionScheduleModel.update(request.body as vendorDistributionScheduleModel, {
            where: { program_id, id },
        });

        if (updatedCount > 0) {
            reply.send({
                status_code: 200,
                message: "Vendor Distribution Schedule updated successfully.",
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                vendor_schedule: [],
                massage: "Vendor Distribution Schedule not found."
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "Internal Server Error",
            trace_id: generateCustomUUID(),
            error,
        });
    }
};

