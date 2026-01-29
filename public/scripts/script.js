console.log('script.js loaded successfully!');

let categories = [];
let tasks = [];
let editingTaskId = null; // null = adding new task, number = editing existing task

async function loadUserGreeting() {
    try {
        console.log('Loading user greeting...');
        let response = await fetch('/users/me', {
            credentials: 'include'
        });
        
        console.log('User response status:', response.status);
        
        if (response.status === 200) {
            let data = await response.json();
            console.log('User data:', data);
            let userName = data.user.fullname || data.user.userName || 'User';
            let title = document.getElementById('title');
            title.innerHTML = `שלום ${userName}`;
            
            // Load categories and tasks after user is loaded
            console.log('Loading categories...');
            await loadCategories();
            console.log('Loading tasks...');
            await loadTasks();
            console.log('Categories:', categories);
            console.log('Tasks:', tasks);
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error loading user:', error);
        window.location.href = '/';
    }
}

async function loadCategories() {
    try {
        let response = await fetch('/categories', {
            credentials: 'include'
        });
        
        if (response.status === 200) {
            let data = await response.json();
            // Handle both cases: when categories exist and when they don't
            if (data.message === "no categories found") {
                categories = [];
            } else {
                categories = data.categories || [];
            }
            populateCategorySelect();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function populateCategorySelect() {
    const select = document.getElementById('taskCategory');
    select.innerHTML = '<option value="">בחר קטגוריה...</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

async function loadTasks() {
    try {
        let response = await fetch('/tasks', {
            credentials: 'include'
        });
        
        if (response.status === 200) {
            let data = await response.json();
            // Handle both cases: when tasks exist and when they don't
            if (data.message === "no tasks found") {
                tasks = [];
            } else {
                tasks = data.tasks || [];
            }
            displayTasksInTable();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function displayTasksInTable() {
    console.log('Displaying tasks in table. Tasks count:', tasks.length);
    const tbody = document.getElementById('tasksTableBody');
    const noTasksMsg = document.getElementById('noTasksMessage');
    const table = document.getElementById('tasksTable');
    
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        console.log('No tasks found, showing message');
        table.style.display = 'none';
        noTasksMsg.style.display = 'block';
        return;
    }

    console.log('Displaying', tasks.length, 'tasks');
    table.style.display = 'table';
    noTasksMsg.style.display = 'none';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.className = task.isDone ? 'completed-task' : '';
        
        const category = categories.find(cat => cat.id === task.category_id);
        const categoryName = category ? category.name : 'ללא קטגוריה';
        
        row.innerHTML = `
            <td class="status-cell">
                <input type="checkbox" ${task.isDone ? 'checked' : ''} 
                       onchange="toggleTask(${task.id}, ${!task.isDone})"
                       class="task-checkbox">
            </td>
            <td class="description-cell ${task.isDone ? 'completed-text' : ''}">
                ${task.description}
            </td>
            <td class="category-cell">
                <span class="category-badge">${categoryName}</span>
            </td>
            <td class="actions-cell">
                <button class="edit-btn-small" onclick="editTask(${task.id})">ערוך</button>
                <button class="delete-btn-small" onclick="deleteTask(${task.id})">מחק</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Fill the form with task data
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskCategory').value = task.category_id;
    
    // Update the button text
    const submitBtn = document.getElementById('submitTaskBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    submitBtn.textContent = 'עדכן משימה';
    cancelBtn.style.display = 'inline-block';
    
    // Store which task we're editing
    editingTaskId = taskId;
    
    // Scroll to the form
    document.querySelector('.add-task-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    // Clear the form
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskCategory').value = '';
    
    // Reset the button text
    const submitBtn = document.getElementById('submitTaskBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    submitBtn.textContent = 'הוסף משימה';
    cancelBtn.style.display = 'none';
    
    // Clear editing state
    editingTaskId = null;
}

async function addTask() {
    const description = document.getElementById('taskDescription').value;
    const categoryId = document.getElementById('taskCategory').value;

    if (!description.trim()) {
        alert('אנא הכנס תיאור למשימה');
        return;
    }

    if (!categoryId) {
        alert('אנא בחר קטגוריה');
        return;
    }

    try {
        let response;
        
        if (editingTaskId) {
            // Update existing task
            const task = tasks.find(t => t.id === editingTaskId);
            response = await fetch(`/tasks/${editingTaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    description: description.trim(),
                    isDone: task.isDone,
                    category_id: parseInt(categoryId)
                })
            });
        } else {
            // Add new task
            response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    description: description.trim(),
                    isDone: 0,
                    category_id: parseInt(categoryId)
                })
            });
        }

        let data = await response.json();
        if (response.status === 200) {
            cancelEdit(); // Reset form
            await loadTasks();
            alert(editingTaskId ? 'המשימה עודכנה בהצלחה!' : 'המשימה נוספה בהצלחה!');
        } else {
            alert(data.message || 'שגיאה בשמירת המשימה');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        alert('שגיאה בשמירת המשימה');
    }
}

async function toggleTask(taskId, isDone) {
    try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        let response = await fetch(`/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                description: task.description,
                isDone: isDone ? 1 : 0,
                category_id: task.category_id
            })
        });

        if (response.status === 200) {
            await loadTasks();
        } else {
            alert('שגיאה בעדכון המשימה');
            await loadTasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        alert('שגיאה בעדכון המשימה');
        await loadTasks();
    }
}

async function deleteTask(taskId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
        return;
    }

    try {
        let response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 200) {
            await loadTasks();
            alert('המשימה נמחקה בהצלחה!');
        } else {
            alert('שגיאה במחיקת המשימה');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('שגיאה במחיקת המשימה');
    }
}

async function addCategory() {
    const name = document.getElementById('categoryName').value;

    if (!name.trim()) {
        alert('אנא הכנס שם לקטגוריה');
        return;
    }

    try {
        let response = await fetch('/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name.trim()
            })
        });

        let data = await response.json();
        if (response.status === 200) {
            document.getElementById('categoryName').value = '';
            await loadCategories();
            alert('הקטגוריה נוספה בהצלחה!');
        } else {
            alert(data.message || 'שגיאה בהוספת הקטגוריה');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('שגיאה בהוספת הקטגוריה');
    }
}

async function logout() {
    try {
        let response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.status === 200) {
            window.location.href = '/';
        } else {
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error logging out:', error);
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/';
    }
}

// Call the function when page loads
loadUserGreeting();
