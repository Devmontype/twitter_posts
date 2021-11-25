function SuccessResponse(res, message, statusCode = 200,data={}, error = {}) {
    return res.status(statusCode).json({
        success: true,
        message:message,
        statusCode:statusCode,
        data:data,
        error:error
    });
};
//errorResponse(res, 'Not found', 404, false);
module.exports={SuccessResponse}