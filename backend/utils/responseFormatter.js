// Response formatter utility for AgroGig
// Standardizes API responses across the application

// Success response formatter
const successResponse = (data, message = 'Success', statusCode = 200) => {
    return {
        success: true,
        message,
        data,
        statusCode
    };
};

// Error response formatter
const errorResponse = (error, message = 'An error occurred', statusCode = 500) => {
    return {
        success: false,
        message,
        error: error instanceof Error ? error.message : error,
        statusCode
    };
};

// Pagination response formatter
const paginatedResponse = (data, pagination, message = 'Success') => {
    return {
        success: true,
        message,
        data,
        pagination,
        statusCode: 200
    };
};

// Validation error response formatter
const validationErrorResponse = (errors, message = 'Validation failed') => {
    return {
        success: false,
        message,
        errors,
        statusCode: 400
    };
};

// Not found response formatter
const notFoundResponse = (resource = 'Resource') => {
    return {
        success: false,
        message: `${resource} not found`,
        statusCode: 404
    };
};

// Unauthorized response formatter
const unauthorizedResponse = (message = 'Unauthorized access') => {
    return {
        success: false,
        message,
        statusCode: 401
    };
};

// Forbidden response formatter
const forbiddenResponse = (message = 'Access forbidden') => {
    return {
        success: false,
        message,
        statusCode: 403
    };
};

// Conflict response formatter
const conflictResponse = (message = 'Resource already exists') => {
    return {
        success: false,
        message,
        statusCode: 409
    };
};

// Format action response
const formatActionResponse = (action) => {
    return {
        id: action.id,
        farmerId: action.farmer_id || action.farmerId,
        type: action.type,
        date: action.date,
        description: action.description,
        cropType: action.crop_type || action.cropType,
        fieldArea: action.field_area || action.fieldArea,
        score: action.score,
        status: action.status,
        createdAt: action.created_at || action.createdAt,
        updatedAt: action.updated_at || action.updatedAt
    };
};

// Format farmer response
const formatFarmerResponse = (farmer) => {
    return {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        language: farmer.language,
        location: farmer.location,
        createdAt: farmer.created_at || farmer.createdAt,
        updatedAt: farmer.updated_at || farmer.updatedAt
    };
};

// Format score response
const formatScoreResponse = (score) => {
    return {
        id: score.id,
        actionId: score.action_id || score.actionId,
        farmerId: score.farmer_id || score.farmerId,
        score: score.score,
        category: score.category,
        createdAt: score.created_at || score.createdAt
    };
};

// Format badge response
const formatBadgeResponse = (badge) => {
    return {
        id: badge.id,
        farmerId: badge.farmer_id || badge.farmerId,
        name: badge.name,
        description: badge.description,
        earnedDate: badge.earned_date || badge.earnedDate
    };
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    validationErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    conflictResponse,
    formatActionResponse,
    formatFarmerResponse,
    formatScoreResponse,
    formatBadgeResponse
};