function errorResponse(res, message, statusCode = 500, error = {}) {
    return res.status(statusCode).json({
        success: false,
        message:message,
        statusCode:statusCode,
        error:error
    });
};
//errorResponse(res, 'Not found', 404, false);
module.exports={errorResponse}