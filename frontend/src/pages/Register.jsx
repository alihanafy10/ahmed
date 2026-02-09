import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser } from '../utils/mockDb';

const InputField = ({ label, name, type = "text", icon: Icon, placeholder, value, onChange, onBlur, error, touched }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="mb-4">
            <label className="block text-zinc-400 text-sm mb-2 font-medium">{label}</label>
            <div className={`relative flex items-center bg-zinc-800/50 border ${error ? 'border-red-500/50' : 'border-zinc-700'} rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all`}>
                <div className="pl-4 text-zinc-500">
                    <Icon />
                </div>
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-white p-3.5 focus:outline-none placeholder:text-zinc-600"
                />
                
                {/* Password Toggle */}
                {isPassword && (
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-4 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}

                {!isPassword && touched && !error && value && (
                    <div className="pr-4 text-green-500">
                        <FaCheckCircle />
                    </div>
                )}
                {!isPassword && error && (
                    <div className="pr-4 text-red-500">
                        <FaExclamationCircle />
                    </div>
                )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1.5 mx-1">{error}</p>}
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: '',
        nationalId: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    // Regex Patterns
    const patterns = {
        fullName: /^[a-zA-Z\u0600-\u06FF\s]{3,}$/, // Letters (English/Arabic) & spaces, min 3
        nationalId: /^\d{14}$/,
        phone: /^(010|011|012|015)\d{8}$/, // Egyptian Mobile
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'fullName':
                if (!patterns.fullName.test(value)) error = "الاسم يجب أن يحتوي على أحرف فقط ولا يقل عن 3 أحرف";
                break;
            case 'nationalId':
                if (!patterns.nationalId.test(value)) error = "الرقم القومي يجب أن يتكون من 14 رقمًا";
                break;
            case 'phone':
                if (!patterns.phone.test(value)) error = "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 010, 011, 012, 015)";
                break;
            case 'email':
                if (!patterns.email.test(value)) error = "البريد الإلكتروني غير صحيح";
                break;
            case 'password':
                if (!patterns.password.test(value)) error = "كلمة المرور يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، رقم، ورمز خاص";
                break;
            case 'confirmPassword':
                if (value !== formData.password) error = "كلمة المرور غير متطابقة";
                break;
            default:
                break;
        }
        return error;
    };

    useEffect(() => {
        const newErrors = {};
        let valid = true;
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                valid = false;
                // Only show error if touched, except for confirmPassword aimed at live feedback
                if (touched[key]) newErrors[key] = error; 
            }
        });
        setErrors(newErrors);
        
        // Check overall validity for button disable (checking values directly)
        const allValid = Object.keys(formData).every(key => !validateField(key, formData[key]));
        setIsValid(allValid);

    }, [formData, touched]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({
            fullName: true, nationalId: true, phone: true, email: true, password: true, confirmPassword: true
        });

        if (isValid) {
            const result = registerUser(formData);
            if (result.success) {
                // navigate to login on success
                navigate('/login');
            } else {
                // Show error (using a simple alert or state for now, or adding a general error field)
                alert(result.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
                    <p className="text-zinc-400">سجل بياناتك للوصول إلى الخدمات</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Blob effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField 
                            label="الاسم بالكامل" 
                            name="fullName" 
                            icon={FaUser} 
                            placeholder="الاسم رباعي" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            onBlur={handleBlur} 
                            error={errors.fullName} 
                            touched={touched.fullName} 
                        />
                        <InputField 
                            label="الرقم القومي" 
                            name="nationalId" 
                            icon={FaIdCard} 
                            placeholder="14 رقم" 
                            value={formData.nationalId} 
                            onChange={handleChange} 
                            onBlur={handleBlur} 
                            error={errors.nationalId} 
                            touched={touched.nationalId} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField 
                            label="رقم الهاتف" 
                            name="phone" 
                            icon={FaPhone} 
                            placeholder="01xxxxxxxxx" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            onBlur={handleBlur} 
                            error={errors.phone} 
                            touched={touched.phone} 
                        />
                        <InputField 
                            label="البريد الإلكتروني" 
                            name="email" 
                            type="email" 
                            icon={FaEnvelope} 
                            placeholder="user@example.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                            onBlur={handleBlur} 
                            error={errors.email} 
                            touched={touched.email} 
                        />
                    </div>

                    <InputField 
                        label="كلمة المرور" 
                        name="password" 
                        type="password" 
                        icon={FaLock} 
                        placeholder="********" 
                        value={formData.password} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        error={errors.password} 
                        touched={touched.password} 
                    />
                    <InputField 
                        label="تأكيد كلمة المرور" 
                        name="confirmPassword" 
                        type="password" 
                        icon={FaLock} 
                        placeholder="********" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        error={errors.confirmPassword} 
                        touched={touched.confirmPassword} 
                    />

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                            isValid 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/20 transform hover:-translate-y-0.5' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                    >
                        تسجيل الدخول
                    </button>

                    <p className="text-center text-zinc-400 mt-6 pt-6 border-t border-zinc-800">
                        لديك حساب بالفعل؟{" "}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                            تسجيل الدخول
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
