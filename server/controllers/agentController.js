import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import { ROLES } from '../config/constants.js';

/**
 * Get all public verified/active agents with property counts
 */
export const getAgents = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    role: ROLES.AGENT,
    isBlocked: { $ne: true },
  };

  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { agencyName: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
    ];
  }

  const [agents, total] = await Promise.all([
    User.find(filter)
      .select('name email phone avatar agencyName bio isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  // Aggregate property counts for each agent
  const agentIds = agents.map((a) => a._id);
  const propertyCounts = await Property.aggregate([
    {
      $match: {
        agent: { $in: agentIds },
        approvalStatus: 'APPROVED',
        status: 'AVAILABLE',
      },
    },
    {
      $group: {
        _id: '$agent',
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = {};
  propertyCounts.forEach((p) => {
    if (p && p._id) {
      countMap[p._id.toString()] = p.count;
    }
  });

  const enrichedAgents = agents.map((agent) => ({
    ...agent,
    propertiesCount: agent._id ? countMap[agent._id.toString()] || 0 : 0,
  }));

  const totalPages = Math.ceil(total / limitNum) || 0;

  res.status(200).json(
    new ApiResponse(200, 'Agents retrieved successfully', {
      agents: enrichedAgents,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    })
  );
});

/**
 * Get single agent profile with active listings
 */
export const getAgentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const agent = await User.findOne({
    _id: id,
    role: ROLES.AGENT,
    isBlocked: { $ne: true },
  })
    .select('name email phone avatar agencyName bio isVerified createdAt')
    .lean();

  if (!agent) {
    throw new ApiError(404, 'Agent not found');
  }

  // Get active properties for this agent
  const properties = await Property.find({
    agent: id,
    approvalStatus: 'APPROVED',
    status: 'AVAILABLE',
  })
    .sort({ createdAt: -1 })
    .populate('category', 'name slug icon')
    .populate('location', 'city state')
    .lean();

  res.status(200).json(
    new ApiResponse(200, 'Agent details retrieved successfully', {
      agent: {
        ...agent,
        propertiesCount: properties.length,
      },
      properties,
    })
  );
});
