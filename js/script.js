// 工具函数：获取所有用户数据
function getUsers() {
    const users = localStorage.getItem('petUsers');
    return users ? JSON.parse(users) : [];
}

// 处理登录表单（针对denglu.html优化）
function handleLoginForm() {
    // 精准匹配登录页的表单（class="login"且包含<h2>登录</h2>）
    const loginForm = document.querySelector('.login');
    if (!loginForm) return;

    const formTitle = loginForm.querySelector('h2');
    if (!formTitle || formTitle.textContent !== '登录') return;

    // 绑定登录按钮点击事件
    const submitBtn = loginForm.querySelector('.btn input[type="button"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            // 获取输入框（denglu.html中顺序为：用户名→密码）
            const usernameInput = loginForm.querySelectorAll('input')[0];
            const passwordInput = loginForm.querySelectorAll('input')[1];
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // 验证输入
            if (!username) {
                alert('请输入用户名');
                usernameInput.focus();
                return;
            }
            
            if (!password) {
                alert('请输入密码');
                passwordInput.focus();
                return;
            }
            
            // 验证用户（从localStorage读取）
            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('登录成功！');
                window.location.href = 'users.html'; // 跳转到用户中心
            } else {
                alert('用户名或密码错误');
            }
        });
    }
}

// 处理注册表单（针对zhuce.html）
function handleRegisterForm() {
    const registerForm = document.querySelector('.login');
    if (!registerForm) return;

    const formTitle = registerForm.querySelector('h2');
    if (!formTitle || formTitle.textContent !== '注册') return;

    const submitBtn = registerForm.querySelector('.btn input[type="button"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            // 获取注册页输入框（顺序：用户名→手机号→密码→确认密码）
            const inputs = registerForm.querySelectorAll('input');
            const username = inputs[0].value.trim();
            const phone = inputs[1].value.trim();
            const password = inputs[2].value;
            const confirmPwd = inputs[3].value;

            // 验证输入
            if (!username) {
                alert('请输入用户名');
                inputs[0].focus();
                return;
            }
            if (!phone) {
                alert('请输入手机号');
                inputs[1].focus();
                return;
            }
            if (password.length < 6) {
                alert('密码长度不能少于6位');
                inputs[2].focus();
                return;
            }
            if (password !== confirmPwd) {
                alert('两次密码输入不一致');
                inputs[3].focus();
                return;
            }

            // 检查用户名是否已存在
            const users = getUsers();
            if (users.some(u => u.username === username)) {
                alert('用户名已存在');
                return;
            }

            // 保存新用户
            const newUser = {
                username,
                phone,
                password,
                registerTime: new Date().toLocaleString() // 记录注册时间
            };
            users.push(newUser);
            localStorage.setItem('petUsers', JSON.stringify(users));
            alert('注册成功，请登录！');
            window.location.href = 'denglu.html'; // 跳转到登录页
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    handleLoginForm();   // 初始化登录功能
    handleRegisterForm(); // 初始化注册功能
});