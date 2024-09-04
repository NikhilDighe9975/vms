
import vendorComplianceDocument from '../models/vendorComplianceDocumentModel';
import { vendorComplianceDocumentInterface } from '../interfaces/vendorComplianceDocumentInterface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { baseSearch } from '../utility/baseService'
import generateCustomUUID from '../utility/genrateTraceId';

export async function createVendorComplianceDocument(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { program_id } = request.params as { program_id: string };
    const vendor_comp_doc = request.body as vendorComplianceDocumentInterface;
    if (!program_id) {
      reply.status(201).send({
        status_code: 201,
        message: "Program id is required.",
        trace_id: generateCustomUUID(),
      });
    }
    const vendor_comp_document = await vendorComplianceDocument.create({ ...vendor_comp_doc, program_id });
    reply.status(201).send({
      status_code: 201,
      trace_id: generateCustomUUID(),
      message:' Vendor compliance documents created successfully',
      vendor_comp_documents: vendor_comp_document?.id
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error
    });
  }
}

export async function vendorComplianceDocumentById(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    console.log('Params:', id, program_id);
    const vendorCompDocuments = await vendorComplianceDocument.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      },
      attributes: { exclude: ['ref_id',] },
    });
    if (vendorCompDocuments) {
      reply.status(201).send({
        status_code: 201,
        message: "vendor compliance documents get succesfully",
        vendor_comp_documents: vendorCompDocuments,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'vendor compliance documents data not found',
        vendor_comp_documents: []
      });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while fetching vendor compliance documents', error });
  }
}
export async function updateVendorComplianceDocumentById(request: FastifyRequest, reply: FastifyReply) {
  const { id, program_id } = request.params as { id: string, program_id: string };
  const updates = request.body as Partial<vendorComplianceDocumentInterface>;
  try {
    const [vendor_comp_documents] = await vendorComplianceDocument.update(updates, {
      where: { id, program_id }
    });
    if (vendor_comp_documents === 0) {
      return reply.status(200).send({ message: 'vendor compliance documents data not found', trace_id: generateCustomUUID(), vendor_comp_documents: [] });
    }
    return reply.status(201).send({
      status_code: 201,
      message: 'vendor compliance documents updated successfully',
      vendor_comp_documents: id,
      trace_id: generateCustomUUID()
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Internal Server Error', trace_id: generateCustomUUID(), error });
  }
}

export async function deleteVendorComplianceDocumentById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const [vendorCompDocuments] = await vendorComplianceDocument.update(
      {
        is_deleted: true,
        is_enabled: false,
        modified_on: Date.now(),
      },
      { where: { id } }
    );
    if (vendorCompDocuments > 0) {
      reply.status(200).send({
        status_code: 200,
        message: "vendor compliance documents deleted successfully",
        vendor_comp_documents: vendorCompDocuments,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'vendor compliance documents not found', trace_id: generateCustomUUID(), vendor_comp_documments: [] });
    }
  } catch (error) {
    console.error('Error deleting vendor compliance documents:', error);
    reply.status(500).send({ message: 'An error occurred while deleting vendor compliance documents', error });
  }
}
export async function getAllVendorCompDocummentByProgramId(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
  const { program_id } = request.params;
  const vendorCompDocuments = await vendorComplianceDocument.findAll({
    where: { program_id: program_id }
  });
  if (vendorCompDocuments.length === 0) {
    return reply.status(200).send({
      status_code: 200,
      message: 'vendor compliance documents data not found for the given program',
      vendor_comp_documents: []
    });
  }
  const searchFields = ['name', 'status', 'description', 'frequency', ' last_updated'];
  const responseFields = ['id', 'name', 'description', 'frequency', 'last_updated', 'is_enabled', 'is_deleted', 'program_id'];
  return baseSearch(request, reply, vendorComplianceDocument, searchFields, responseFields);
}

