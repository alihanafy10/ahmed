const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Always log error to console for debugging
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        let arabicField = field;
        if (field === 'email') arabicField = 'البريد الإلكتروني';
        if (field === 'phone') arabicField = 'رقم الهاتف';
        if (field === 'nationalId') arabicField = 'الرقم القومي';
        const message = `${arabicField} مسجل بالفعل`;
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'رمز التحقق غير صحيح';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'انتهت صلاحية رمز التحقق';
        error = { message, statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'حدث خطأ في الخادم',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
