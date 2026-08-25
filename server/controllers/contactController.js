import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { createContactEnquiry as createContactEnquiryService } from '../services/contactService.js';

// @desc    Submit general contact enquiry (Public)
// @route   POST /api/v1/contact
// @access  Public
export const createContactEnquiry = asyncHandler(async (req, res) => {
  const result = await createContactEnquiryService(req.body);

  return res.status(201).json(
    new ApiResponse(201, 'Contact enquiry submitted successfully.', {
      enquiryId: result.enquiryId,
    })
  );
});

export default {
  createContactEnquiry,
};
