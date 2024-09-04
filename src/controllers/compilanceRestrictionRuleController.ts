import { FastifyRequest, FastifyReply } from "fastify";
import CompilanceRestrictionRule from "../models/compilanceRestrictionRuleModel";
import { CompilanceRestrictionRuleData } from "../interfaces/compilanceRestrictionRuleInterface"
import generateCustomUUID from "../utility/genrateTraceId"
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import Tenant from "../models/tenantModel";

export async function getCompilanceRestrictionRules(
    request: FastifyRequest<{ Querystring: CompilanceRestrictionRuleData }>,
    reply: FastifyReply
) {
    try {
        const { program_id } = request.params as { program_id: string };
        const query = request.query as CompilanceRestrictionRuleData | any;
        const page = parseInt(query.page ?? "1");
        const limit = parseInt(query.limit ?? "10");
        const offset = (page - 1) * limit;
        query.page && delete query.page;
        query.limit && delete query.limit;
        const rules = await CompilanceRestrictionRule.findAll({
            where: {
                ...query, is_deleted: false, program_id
            },
            limit,
            offset,
            order: [["created_on", "DESC"]]
        });
        if (rules.length === 0) {
            return reply.status(200).send({ message: "Compilance Restriction Rules not found", rules: [] });
        }
        const rulesWithCalculatedFields = rules.map(rule => {
            const startDate = new Date(rule.start_date);
            const endDate = new Date(rule.end_date);
            const days = differenceInDays(endDate, startDate);
            const time_month = differenceInMonths(endDate, startDate);
            const time_year = differenceInYears(endDate, startDate);
            const vendor_count=rule.vendor_ids?.length
            return {
                ...rule.toJSON(),
                days,
                time_month,
                time_year,
                vendor_count
            };
        });
        reply.status(200).send({
            status_code: 200,
            items_per_page: rulesWithCalculatedFields.length,
            total_records: rulesWithCalculatedFields.length,
            vendor_compliance_rules: rulesWithCalculatedFields,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function getCompilanceRuleById(request: FastifyRequest, reply: FastifyReply) {
    const { id, program_id } = request.params as { id: string, program_id: string };
    try {
        const rule = await CompilanceRestrictionRule.findOne({
            where: {
                id,
                is_deleted: false,
                program_id
            },
            include: [
                {
                    model: Tenant,
                    as: "vendors",
                    attributes: ["id", "name", "type"],
                }
            ]
        });
        if (!rule) {
            return reply.status(200).send({
                status_code: 200,
                message: "Compilance Restriction Rule Not Found",
                trace_id: generateCustomUUID(),
            });
        }
        const startDate = new Date(rule.start_date);
        const endDate = new Date(rule.end_date);
        const days = differenceInDays(endDate, startDate);
        const time_month = differenceInMonths(endDate, startDate);
        const time_year = differenceInYears(endDate, startDate);
        const vendor_count=rule.vendor_ids?.length
        const ruleWithCalculatedFields = {
            ...rule.toJSON(),
            days,
            time_month,
            time_year,
            vendor_count
        };
        reply.status(200).send({
            status_code: 200,
            rule: ruleWithCalculatedFields,
            trace_id: generateCustomUUID(),
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            status_code: 500,
            message: "Internal Server Error",
            trace_id: generateCustomUUID(),
        });
    }
}

export const createCompilanceRestrictionRule = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const data1 = request.body as Partial<CompilanceRestrictionRuleData>;
        const newItem = await CompilanceRestrictionRule.create(data1);
        if (data1.vendor_ids) {
            await newItem.setVendors(data1.vendor_ids);
        }
        reply.status(201).send({
            status_code: 201,
            rule: newItem.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error: any) {
        if (error.name === "SequelizeUniqueConstraintError") {
            const field = error.errors[0].path;
            return reply.status(400).send({ error: `${field} already in use!` });
        }
        console.error(error);
        return reply.status(500).send({ message: "Failed To Create Compilance Existing Rule", error });
    }
};

export async function updateRule(request: FastifyRequest, reply: FastifyReply) {
    const { id, program_id } = request.params as { id: string, program_id: string };
    const CompilanceRestrictionRuleData = request.body as CompilanceRestrictionRuleData;
    try {
        const rule = await CompilanceRestrictionRule.findOne({
            where: {
                id,
                program_id,
                is_deleted: false,
            }
        })
        if (rule) {
            await rule.update(CompilanceRestrictionRuleData);
            reply.status(200).send({
                status_code: 200,
                rule_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(400).send({ message: "Compilance Restriction Rule Not Found" });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}
export const deleteRule = async (request: FastifyRequest<{ Params: { id: string, program_id: string } }>, reply: FastifyReply) => {
    try {
        const { id, program_id } = request.params;
        const [updatedRows] = await CompilanceRestrictionRule.update(
            {
                is_enabled: false,
                is_deleted: true,
            },
            {
                where: { id, program_id }
            }
        );
        if (updatedRows > 0) {
            reply.status(200).send({
                status_code: 200,
                message: 'Compilance Restriction Rule Deleted successfully',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: "Compilance Restriction Rule Not Found",
                trace_id: generateCustomUUID(),
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: "Failed to delete Compilance Restriction Rule",
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
};


