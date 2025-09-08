// 初始化管理员账号（如果不存在）
function initAdminAccount() {
    if (!localStorage.getItem('admin')) {
        // 默认管理员账号
        const defaultAdmin = {
            username: '管理员',
            password: 'admin123', // 默认密码
            lastLogin: null
        };
        localStorage.setItem('admin', JSON.stringify(defaultAdmin));
    }
}

// 获取管理员信息
function getAdmin() {
    return JSON.parse(localStorage.getItem('admin') || 'null');
}

// 保存管理员信息
function saveAdmin(admin) {
    localStorage.setItem('admin', JSON.stringify(admin));
}

// 管理员登录验证
function adminLogin(username, password) {
    const admin = getAdmin();
    if (admin && admin.username === username && admin.password === password) {
        // 更新最后登录时间
        admin.lastLogin = new Date().toLocaleString();
        saveAdmin(admin);
        // 保存登录状态
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        return true;
    }
    return false;
}

// 检查管理员是否已登录
function isAdminLoggedIn() {
    return localStorage.getItem('currentAdmin') !== null;
}

// 获取当前登录的管理员
function getCurrentAdmin() {
    return JSON.parse(localStorage.getItem('currentAdmin') || 'null');
}

// 管理员退出登录
function adminLogout() {
    localStorage.removeItem('currentAdmin');
}

// 修改管理员密码
function changeAdminPassword(oldPassword, newPassword) {
    const admin = getAdmin();
    if (!admin) return false;

    // 验证原密码
    if (admin.password !== oldPassword) return false;

    // 更新密码
    admin.password = newPassword;
    saveAdmin(admin);

    // 更新当前登录状态中的密码
    const currentAdmin = getCurrentAdmin();
    if (currentAdmin) {
        currentAdmin.password = newPassword;
        localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
    }

    return true;
}

// 获取所有普通用户
function getAllUsers() {
    return JSON.parse(localStorage.getItem('petUsers') || '[]');
}

// 删除指定用户
function deleteUser(username) {
    let users = getAllUsers();
    users = users.filter(user => user.username !== username);
    localStorage.setItem('petUsers', JSON.stringify(users));
    return true;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    initAdminAccount();

    // 为管理员登录表单绑定事件
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (adminLogin(username, password)) {
                alert('登录成功！');
                window.location.href = 'admin_dashboard.html';
            } else {
                alert('管理员账号或密码错误');
            }
        });
    }

    // 管理员退出登录功能
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('确定要退出登录吗？')) {
                adminLogout();
                window.location.href = 'admin_login.html';
            }
        });
    }

    // 管理员修改密码功能
    const changePwdBtn = document.getElementById('changeAdminPwd');
    if (changePwdBtn) {
        changePwdBtn.addEventListener('click', function () {
            const oldPwd = prompt('请输入原密码：');
            if (!oldPwd) return;

            const newPwd = prompt('请输入新密码（不少于6位）：');
            if (!newPwd || newPwd.length < 6) {
                alert('密码长度不能少于6位');
                return;
            }

            const confirmPwd = prompt('请再次输入新密码：');
            if (newPwd !== confirmPwd) {
                alert('两次输入的密码不一致');
                return;
            }

            if (changeAdminPassword(oldPwd, newPwd)) {
                alert('密码修改成功，请使用新密码登录');
                adminLogout();
                window.location.href = 'admin_login.html';
            } else {
                alert('原密码错误，无法修改');
            }
        });
    }

    // 加载用户列表（在管理员面板页面）
    const userListContainer = document.getElementById('userListContainer');
    if (userListContainer) {
        // 验证管理员登录状态
        if (!isAdminLoggedIn()) {
            alert('请先登录管理员账号');
            window.location.href = 'admin_login.html';
            return;
        }

        loadUserList();
    }
});

// 加载并显示用户列表
function loadUserList() {
    const users = getAllUsers();
    const container = document.getElementById('userListContainer');

    if (users.length === 0) {
        container.innerHTML = '<p class="no-users">暂无注册用户</p>';
        return;
    }

    let html = `
        <table class="user-table">
            <tr>
                <th>用户名</th>
                <th>手机号</th>
                <th>注册时间</th>
                <th>操作</th>
            </tr>
    `;

    users.forEach(user => {
        html += `
            <tr>
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.registerTime}</td>
                <td>
                    <button class="delete-btn" onclick="confirmDelete('${user.username}')">删除</button>
                </td>
            </tr>
        `;
    });

    html += '</table>';
    container.innerHTML = html;
}

// 确认删除用户
function confirmDelete(username) {
    if (confirm(`确定要删除用户"${username}"吗？此操作不可恢复。`)) {
        deleteUser(username);
        loadUserList();
        alert(`用户"${username}"已成功删除`);
    }
}
