import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { authAPI } from '../config/api';

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
        confirmPassword: '',
        birthDate: '',
        address: '',
        governorate: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

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
                if (!value || value.trim().length < 3) error = "الاسم يجب أن لا يقل عن 3 أحرف";
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
                if (value.length < 8) error = "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل";
                break;
            case 'confirmPassword':
                if (value !== formData.password) error = "كلمة المرور غير متطابقة";
                break;
            case 'birthDate':
                if (!value) error = "تاريخ الميلاد مطلوب";
                break;
            case 'address':
                if (!value || value.trim().length < 5) error = "العنوان يجب أن لا يقل عن 5 أحرف";
                break;
            case 'governorate':
                if (!value) error = "المحافظة مطلوبة";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({
            fullName: true, nationalId: true, phone: true, email: true, 
            password: true, confirmPassword: true, birthDate: true, 
            address: true, governorate: true
        });

        if (isValid && !isSubmitting) {
            setIsSubmitting(true);
            setApiError('');

            try {
                const { confirmPassword, ...registerData } = formData;
                const response = await authAPI.register(registerData);

                if (response.data.success) {
                    // Save token and user data
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                    
                    // Navigate to home or face capture
                    navigate('/face-capture');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.';
                setApiError(errorMessage);
                console.error('Registration error:', error);
            } finally {
                setIsSubmitting(false);
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

                    {/* API Error Message */}
                    {apiError && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            <FaExclamationCircle className="inline ml-2" />
                            {apiError}
                        </div>
                    )}

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <InputField 
                        label="تاريخ الميلاد" 
                        name="birthDate" 
                        type="date" 
                        icon={FaCalendar} 
                        placeholder="" 
                        value={formData.birthDate} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        error={errors.birthDate} 
                        touched={touched.birthDate} 
                    />

                    <InputField 
                        label="العنوان" 
                        name="address" 
                        icon={FaMapMarkerAlt} 
                        placeholder="العنوان بالتفصيل" 
                        value={formData.address} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        error={errors.address} 
                        touched={touched.address} 
                    />

                    <div className="mb-4">
                        <label className="block text-zinc-400 text-sm mb-2 font-medium">المحافظة</label>
                        <div className={`relative flex items-center bg-zinc-800/50 border ${errors.governorate ? 'border-red-500/50' : 'border-zinc-700'} rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all`}>
                            <div className="pl-4 text-zinc-500">
                                <FaMapMarkerAlt />
                            </div>
                            <select
                                name="governorate"
                                value={formData.governorate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full bg-transparent text-white p-3.5 focus:outline-none"
                            >
                                <option value="" className="bg-zinc-800">اختر المحافظة</option>
                                <option value="القاهرة" className="bg-zinc-800">القاهرة</option>
                                <option value="الجيزة" className="bg-zinc-800">الجيزة</option>
                                <option value="الإسكندرية" className="bg-zinc-800">الإسكندرية</option>
                                <option value="الدقهلية" className="bg-zinc-800">الدقهلية</option>
                                <option value="الشرقية" className="bg-zinc-800">الشرقية</option>
                                <option value="المنوفية" className="bg-zinc-800">المنوفية</option>
                                <option value="القليوبية" className="bg-zinc-800">القليوبية</option>
                                <option value="البحيرة" className="bg-zinc-800">البحيرة</option>
                                <option value="الغربية" className="bg-zinc-800">الغربية</option>
                                <option value="بورسعيد" className="bg-zinc-800">بورسعيد</option>
                                <option value="السويس" className="bg-zinc-800">السويس</option>
                                <option value="الإسماعيلية" className="bg-zinc-800">الإسماعيلية</option>
                                <option value="دمياط" className="bg-zinc-800">دمياط</option>
                                <option value="كفر الشيخ" className="bg-zinc-800">كفر الشيخ</option>
                                <option value="الفيوم" className="bg-zinc-800">الفيوم</option>
                                <option value="بني سويف" className="bg-zinc-800">بني سويف</option>
                                <option value="المنيا" className="bg-zinc-800">المنيا</option>
                                <option value="أسيوط" className="bg-zinc-800">أسيوط</option>
                                <option value="سوهاج" className="bg-zinc-800">سوهاج</option>
                                <option value="قنا" className="bg-zinc-800">قنا</option>
                                <option value="أسوان" className="bg-zinc-800">أسوان</option>
                                <option value="الأقصر" className="bg-zinc-800">الأقصر</option>
                                <option value="البحر الأحمر" className="bg-zinc-800">البحر الأحمر</option>
                                <option value="الوادي الجديد" className="bg-zinc-800">الوادي الجديد</option>
                                <option value="مطروح" className="bg-zinc-800">مطروح</option>
                                <option value="شمال سيناء" className="bg-zinc-800">شمال سيناء</option>
                                <option value="جنوب سيناء" className="bg-zinc-800">جنوب سيناء</option>
                            </select>
                        </div>
                        {errors.governorate && <p className="text-red-400 text-xs mt-1.5 mx-1">{errors.governorate}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                            isValid && !isSubmitting
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/20 transform hover:-translate-y-0.5' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'جاري التسجيل...' : 'إنشاء حساب'}
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
