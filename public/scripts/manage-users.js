console.log('manage-users.js loaded successfully!');

let users = [];
let editingUserId = null;

// Load all users on page load
window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

async function loadUsers() {
    try {
        console.log('Fetching users...');
        const response = await fetch('/users', {
            credentials: 'include'
        });
        
        if (response.status === 401) {
            // Not logged in - redirect to login
            window.location.href = '/';
            return;
        }
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('Users data:', data);
            users = data.users || [];
            displayUsersInTable();
        } else {
            console.error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsersInTable() {
    console.log('Displaying users in table. Total users:', users.length);
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">אין משתמשים במערכת</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.userName}</td>
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td class="actions-cell">
                <button class="edit-btn-small" onclick="editUser(${user.id})">ערוך</button>
                <button class="delete-btn-small" onclick="deleteUser(${user.id})">מחק</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('userName').value = user.userName;
    document.getElementById('fullName').value = user.fullname;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = ''; // Don't show password
    
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitUserBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    formTitle.textContent = 'ערוך משתמש';
    submitBtn.textContent = 'עדכן משתמש';
    cancelBtn.style.display = 'inline-block';
    
    editingUserId = userId;
    
    document.querySelector('.add-user-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('userName').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitUserBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    formTitle.textContent = 'הוסף משתמש חדש';
    submitBtn.textContent = 'הוסף משתמש';
    cancelBtn.style.display = 'none';
    
    editingUserId = null;
}

async function addUser() {
    const userName = document.getElementById('userName').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    if (!userName.trim() || !fullName.trim() || !email.trim()) {
        alert('אנא מלא את כל השדות החובה');
        return;
    }

    if (!editingUserId && !password.trim()) {
        alert('אנא הכנס סיסמה למשתמש החדש');
        return;
    }

    try {
        let response;
        
        if (editingUserId) {
            // Update existing user
            const body = {
                userName: userName.trim(),
                fullname: fullName.trim(),
                email: email.trim()
            };
            
            // Only include password if provided
            if (password.trim()) {
                body.pass = password.trim();
            }
            
            response = await fetch(`/users/${editingUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        } else {
            // Add new user
            response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName: userName.trim(),
                    fullname: fullName.trim(),
                    email: email.trim(),
                    pass: password.trim()
                })
            });
        }

        const data = await response.json();
        if (response.status === 200) {
            cancelEdit();
            await loadUsers();
            alert(editingUserId ? 'המשתמש עודכן בהצלחה!' : 'המשתמש נוסף בהצלחה!');
        } else {
            alert(data.message || 'שגיאה בשמירת המשתמש');
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('שגיאה בשמירת המשתמש');
    }
}

async function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${user.fullname}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (response.status === 200) {
            await loadUsers();
            alert('המשתמש נמחק בהצלחה!');
        } else {
            alert(data.message || 'שגיאה במחיקת המשתמש');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('שגיאה במחיקת המשתמש');
    }
}
