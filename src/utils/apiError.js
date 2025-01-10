class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [], // Default to an empty array
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.errors = errors; // Assign the passed `errors` argument

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
