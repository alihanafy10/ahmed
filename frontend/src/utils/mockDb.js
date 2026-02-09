export const getUsers = () => {
    const users = localStorage.getItem('users_db');
    return users ? JSON.parse(users) : [];
};

export const registerUser = (userData) => {
    const users = getUsers();
    
    // Check for duplicates
    const emailExists = users.some(u => u.email === userData.email);
    const phoneExists = users.some(u => u.phone === userData.phone);
    const idExists = users.some(u => u.nationalId === userData.nationalId);

    if (emailExists) return { success: false, message: "البريد الإلكتروني مسجل بالفعل" };
    if (phoneExists) return { success: false, message: "رقم الهاتف مسجل بالفعل" };
    if (idExists) return { success: false, message: "الرقم القومي مسجل بالفعل" };

    // Add new user
    const newUser = { ...userData, id: Date.now().toString() };
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    
    return { success: true };
};

export const loginUser = (identifier, password) => {
    const users = getUsers();
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);

    if (user) {
        // Return user without password
        const { password, ...safeUser } = user;
        return { success: true, user: safeUser };
    }

    return { success: false, message: "بيانات الدخول غير صحيحة" };
};
