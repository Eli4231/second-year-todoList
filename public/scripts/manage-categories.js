console.log('manage-categories.js loaded successfully!');

let categories = [];
let tasks = [];
let editingCategoryId = null;

// Load all categories on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadTasks();
});

async function loadCategories() {
    try {
        console.log('Fetching categories...');
        const response = await fetch('/categories', {
            credentials: 'include'
        });
        
        if (response.status === 401) {
            // Not logged in - redirect to login
            window.location.href = '/';
            return;
        }
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('Categories data:', data);
            
            if (data.message === "no categories found") {
                categories = [];
            } else {
                categories = data.categories || [];
            }
            displayCategoriesInTable();
        } else {
            console.error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadTasks() {
    try {
        const response = await fetch('/tasks', {
            credentials: 'include'
        });
        
        if (response.status === 200) {
            const data = await response.json();
            if (data.message === "no tasks found") {
                tasks = [];
            } else {
                tasks = data.tasks || [];
            }
            // Refresh display after loading tasks
            displayCategoriesInTable();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function displayCategoriesInTable() {
    console.log('Displaying categories in table. Total categories:', categories.length);
    const tbody = document.getElementById('categoriesTableBody');
    tbody.innerHTML = '';

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">אין קטגוריות במערכת</td></tr>';
        return;
    }

    categories.forEach(category => {
        // Count tasks in this category
        const taskCount = tasks.filter(t => t.category_id === category.id).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td style="text-align: center;">
                <span class="category-badge">${taskCount}</span>
            </td>
            <td class="actions-cell">
                <button class="edit-btn-small" onclick="editCategory(${category.id})">ערוך</button>
                <button class="delete-btn-small" onclick="deleteCategory(${category.id})">מחק</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    document.getElementById('categoryName').value = category.name;
    
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitCategoryBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    formTitle.textContent = 'ערוך קטגוריה';
    submitBtn.textContent = 'עדכן קטגוריה';
    cancelBtn.style.display = 'inline-block';
    
    editingCategoryId = categoryId;
    
    document.querySelector('.add-category-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('categoryName').value = '';
    
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitCategoryBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    formTitle.textContent = 'הוסף קטגוריה חדשה';
    submitBtn.textContent = 'הוסף קטגוריה';
    cancelBtn.style.display = 'none';
    
    editingCategoryId = null;
}

async function addCategory() {
    const name = document.getElementById('categoryName').value;

    if (!name.trim()) {
        alert('אנא הכנס שם לקטגוריה');
        return;
    }

    try {
        let response;
        
        if (editingCategoryId) {
            // Update existing category
            response = await fetch(`/categories/${editingCategoryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: name.trim()
                })
            });
        } else {
            // Add new category
            response = await fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: name.trim()
                })
            });
        }

        const data = await response.json();
        if (response.status === 200) {
            cancelEdit();
            await loadCategories();
            alert(editingCategoryId ? 'הקטגוריה עודכנה בהצלחה!' : 'הקטגוריה נוספה בהצלחה!');
        } else {
            alert(data.message || 'שגיאה בשמירת הקטגוריה');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        alert('שגיאה בשמירת הקטגוריה');
    }
}

async function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    // Check if category has tasks
    const tasksInCategory = tasks.filter(t => t.category_id === categoryId);
    let confirmMsg = `האם אתה בטוח שברצונך למחוק את הקטגוריה "${category.name}"?`;
    
    if (tasksInCategory.length > 0) {
        confirmMsg += `\n\n⚠️ אזהרה: לקטגוריה זו יש ${tasksInCategory.length} משימות!\n`;
        confirmMsg += `כל המשימות הללו יימחקו יחד עם הקטגוריה.\n\n`;
        confirmMsg += `האם אתה בטוח שברצונך להמשיך?`;
    }

    if (!confirm(confirmMsg)) {
        return;
    }

    try {
        const response = await fetch(`/categories/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (response.status === 200) {
            await loadCategories();
            await loadTasks(); // Refresh tasks list
            
            if (tasksInCategory.length > 0) {
                alert(`הקטגוריה "${category.name}" ו-${tasksInCategory.length} משימות נמחקו בהצלחה!`);
            } else {
                alert('הקטגוריה נמחקה בהצלחה!');
            }
        } else {
            alert(data.message || 'שגיאה במחיקת הקטגוריה');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('שגיאה במחיקת הקטגוריה');
    }
}

