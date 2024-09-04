import vendorInviteModel from "../models/vendorInviteModel";
import { vendorInviteInterface } from "../interfaces/vendorInviteInterface";
import { advanceSearch, baseSearch } from "../utility/baseService";
import generateCustomUUID from "../utility/genrateTraceId";
import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

export async function getVendorInvite(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
    const { program_id } = request.params;
    const vendor = await vendorInviteModel.findAll({
        where: { program_id: program_id }
    });
    if (vendor.length === 0) {
        return reply.status(200).send({
            status_code: 200,
            message: "No Vendor found for the given program",
            vendor_invite: []
        });
    }
    const searchFields = ["program_id", "vendor_name", "email", "is_enabled", "invited_on", "first_name", "status", "last_name", "code"]
    const responseFields = ["program_id", "id", "vendor_name", "email", "first_name", "last_name", "is_enabled", "status", "invited_on", "code"]
    return baseSearch(request, reply, vendorInviteModel, searchFields, responseFields)
}

export async function advanceSearchInvite(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
    const { program_id } = request.params;
    const vendor = await vendorInviteModel.findAll({
        where: { program_id: program_id }
    });
    console.log(vendor);

    if (vendor.length === 0) {
        return reply.status(200).send({
            status_code: 200,
            message: "No Vendor found for the given program",
            vendor_invite: []
        });
    }
    const searchFields = ["id", "status", "vendor_name", "email", "invited_on","code"];
    const responseFields = ["id",  "status", "vendor_name", "invited_on", "is_enabled",  "program_id", "created_on","code"];
    return advanceSearch(request, reply, vendorInviteModel, searchFields, responseFields);
}

export async function getVendorInviteById(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const vendor_invite = await vendorInviteModel.findOne({ where: { program_id, id } });
        if (vendor_invite) {
            reply.status(200).send({
                status_code: 200,
                message: "Vendor Invite fetch Successfully.",
                trace_id: generateCustomUUID(),
                vendor_invite: vendor_invite
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: "Vendor Invite not found.",
                vendor_invite: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "An error occurred while fetching VendorInvite.",
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export const createVendorInvite = async (request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) => {
    const program_id = request.params.program_id;
    const vendor_invite = request.body as vendorInviteInterface;

    try {
        const vendorInviteData: any = await vendorInviteModel.create({ ...vendor_invite, program_id });

        reply.status(201).send({
            status_code: 201,
            id: vendorInviteData.id,
            trace_id: generateCustomUUID(),
            message: "Vendor Invite Successfully.",
        });

        const tokenPromise = axios.post(`${process.env.AUTH_SERVICE_URL}`, {
            eventInfo: {
                mode: "SYNC",
                eventType: "notification-auth-event",
                eventDestination: "notification-auth"
            },
            data: {
                payload: {
                    type: "CLIENT_LOGIN",
                    clientId: `${process.env.CLIENT_ID}`,
                    clientSecret: `${process.env.CLIENT_SECRET}`
                }
            }
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const tokenResponse = await tokenPromise;
        const accessToken = tokenResponse.data.data.access_token;

        const emailPromise = axios.post(`${process.env.EMAIL_SERVICE_URL}`, {
            entityRefId: "credentialing",
            traceId: generateCustomUUID(),
            eventCode: "INVITE_CANDIDATE",
            channels: ["EMAIL"],
            recipient: {
                email: {
                    to: [{ email: vendor_invite.email }],
                    sender: { email: `${process.env.EMAIL_SENDER}` }
                }
            },
            payload: {
                linkId: vendorInviteData.id,
                vendor_name: vendor_invite.vendor_name,
                emailId: vendor_invite.email,
                candidate_name: vendor_invite.vendor_name,
                invitationLink: `${process.env.INVITATION_URL}/${vendorInviteData.id}?token=${accessToken}`
            },
            language: "en"
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        await Promise.all([tokenPromise, emailPromise]);


    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "An error occurred while creating VendorInvite.",
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}

export async function updateVendorInvite(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    const { program_id, id } = request.params;
    try {
        const [updatedCount] = await vendorInviteModel.update(request.body as vendorInviteInterface, { where: { program_id, id } });
        if (updatedCount) {
            reply.status(201).send({
                status_code: 201,
                trace_id: generateCustomUUID(),
                message: "Vendor Invite Updated Successfully.",
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                trace_id: generateCustomUUID(),
                vendor_invite: [],
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "An error occurred while updating VendorInvite.",
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}

export async function deleteVendorInvite(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const vendor_invite = await vendorInviteModel.findOne({ where: { program_id, id } });
        if (vendor_invite) {
            await vendorInviteModel.update({ is_deleted: true, is_enabled: false }, { where: { program_id, id } });
            reply.status(204).send({
                status_code: 204,
                trace_id: generateCustomUUID(),
                message: "VendorInvite deleted successfully.",
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                trace_id: generateCustomUUID(),
                vendor_invite: [],
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "An error occurred while deleting VendorInvite.",
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}