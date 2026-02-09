import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser } from '../utils/mockDb';

const Login = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        identifier: '', // Email or Phone
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Regex Patterns (reused/simplified)
    const patterns = {
        phone: /^(010|011|012|015)\d{8}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    const validate = () => {
        const newErrors = {};
        const { identifier, password } = formData;

        if (!identifier) {
            newErrors.identifier = "مطلوب البريد الإلكتروني أو رقم الهاتف";
        } else if (!patterns.email.test(identifier) && !patterns.phone.test(identifier)) {
            newErrors.identifier = "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح";
        }

        if (!password) {
            newErrors.password = "مطلوب كلمة المرور";
        } else if (password.length < 8) {
            newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change if desired, or keep until blur/submit
        if (errors[name]) {
             setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ identifier: true, password: true });
        
        if (validate()) {
            const result = loginUser(formData.identifier, formData.password);
            if (result.success) {
                // In a real app, we would verify credentials here
                // Save user session if needed
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                navigate('/face-capture');
            } else {
                alert(result.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
                    <p className="text-zinc-400">مرحباً بك مجدداً</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                     {/* Blob effect */}
                     <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500" />

                    <div className="mb-6">
                        <label className="block text-zinc-400 text-sm mb-2 font-medium">البريد الإلكتروني أو الهاتف</label>
                        <div className={`relative flex items-center bg-zinc-800/50 border ${errors.identifier ? 'border-red-500/50' : 'border-zinc-700'} rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all`}>
                            <div className="pl-4 text-zinc-500">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="user@example.com أو 01xxxxxxxxx"
                                className="w-full bg-transparent text-white p-3.5 focus:outline-none placeholder:text-zinc-600"
                            />
                        </div>
                        {errors.identifier && touched.identifier && <p className="text-red-400 text-xs mt-1.5 mx-1 flex items-center gap-1"><FaExclamationCircle /> {errors.identifier}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-zinc-400 text-sm mb-2 font-medium">كلمة المرور</label>
                        <div className={`relative flex items-center bg-zinc-800/50 border ${errors.password ? 'border-red-500/50' : 'border-zinc-700'} rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all`}>
                            <div className="pl-4 text-zinc-500">
                                <FaLock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="********"
                                className="w-full bg-transparent text-white p-3.5 focus:outline-none placeholder:text-zinc-600"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="px-4 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && touched.password && <p className="text-red-400 text-xs mt-1.5 mx-1 flex items-center gap-1"><FaExclamationCircle /> {errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-4 bg-white text-zinc-950 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                    >
                         <FaSignInAlt /> تسجيل الدخول
                    </button>

                    <p className="text-center text-zinc-400 mt-6 pt-6 border-t border-zinc-800">
                        ليس لديك حساب؟{" "}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                            أنشئ حساب جديد
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
