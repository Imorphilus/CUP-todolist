// CUP App - Task Prioritization System

// DOM Elements - User Selection Screen
const userSelectionScreen = document.getElementById('user-selection');
const userButtonsContainer = document.getElementById('user-buttons');
const addUserBtn = document.getElementById('add-user-btn');

// DOM Elements - Task Screen
const taskScreen = document.getElementById('task-screen');
const usernameSpan = document.getElementById('username');
const backToUsersBtn = document.getElementById('back-to-users');
const activeTab = document.getElementById('active-tab');
const allTab = document.getElementById('all-tab');
const categoryFilter = document.getElementById('category-filter');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const manageCategoriesBtn = document.getElementById('manage-categories-btn');
const helpButton = document.getElementById('help-button');

// DOM Elements - Task Modal
const addTaskModal = document.getElementById('add-task-modal');
const taskModalTitle = document.getElementById('task-modal-title');
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskDescriptionInput = document.getElementById('task-description');
const taskCurrentInput = document.getElementById('task-current');
const taskUltimateInput = document.getElementById('task-ultimate');
const taskCategorySelect = document.getElementById('task-category');
const cancelTaskBtn = document.getElementById('cancel-task-btn');

// DOM Elements - User Modal
const addUserModal = document.getElementById('add-user-modal');
const userForm = document.getElementById('user-form');
const newUsernameInput = document.getElementById('new-username');
const cancelUserBtn = document.getElementById('cancel-user-btn');

// DOM Elements - Categories Modal
const categoriesModal = document.getElementById('categories-modal');
const categoriesList = document.getElementById('categories-list');
const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const addCategoryBtn = document.getElementById('add-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

// DOM Elements - Help Modal
const helpModal = document.getElementById('help-modal');
const closeHelpBtn = document.getElementById('close-help-btn');

// App State
let users = [];
let currentUser = null;
let showAllTasks = false;
let currentCategoryFilter = 'all';
let editingCategoryIndex = -1;

// Initialize the app
function initApp() {
    loadUsers();
    renderUsers();
    setupEventListeners();
}

// Load users from local storage
function loadUsers() {
    const savedUsers = localStorage.getItem('cup-users');
    users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // If no users exist, show the add user modal immediately
    if (users.length === 0) {
        setTimeout(() => showAddUserModal(), 500);
    }
}

// Get sample tasks for new users
function getSampleTasks() {
    return [
        {
            id: generateId(),
            description: 'Complete CUP app setup',
            current: 8,
            ultimate: 9,
            priority: 17,
            category: 'Day Job',
            status: 'A'
        },
        {
            id: generateId(),
            description: 'Review priorities each morning',
            current: 7,
            ultimate: 8,
            priority: 15,
            category: 'Self',
            status: 'A'
        }
    ];
}

// Save users to local storage
function saveUsers() {
    localStorage.setItem('cup-users', JSON.stringify(users));
}

// Set up all event listeners
function setupEventListeners() {
    // User navigation
    addUserBtn.addEventListener('click', showAddUserModal);
    backToUsersBtn.addEventListener('click', showUserSelection);
    
    // Task view controls
    activeTab.addEventListener('click', () => {
        showAllTasks = false;
        activeTab.classList.add('active');
        allTab.classList.remove('active');
        renderTasks();
    });
    
    allTab.addEventListener('click', () => {
        showAllTasks = true;
        allTab.classList.add('active');
        activeTab.classList.remove('active');
        renderTasks();
    });
    
    categoryFilter.addEventListener('change', () => {
        currentCategoryFilter = categoryFilter.value;
        renderTasks();
    });
    
    // Task actions
    addTaskBtn.addEventListener('click', showAddTaskModal);
    taskForm.addEventListener('submit', handleTaskSubmit);
    cancelTaskBtn.addEventListener('click', hideTaskModal);
    
    // User actions
    userForm.addEventListener('submit', handleUserSubmit);
    cancelUserBtn.addEventListener('click', hideUserModal);
    
    // Category actions
    manageCategoriesBtn.addEventListener('click', showCategoriesModal);
    addCategoryBtn.addEventListener('click', showCategoryForm);
    categoryForm.addEventListener('submit', handleCategorySubmit);
    cancelCategoryBtn.addEventListener('click', hideCategoryForm);
    closeCategoriesBtn.addEventListener('click', hideCategoriesModal);
    
    // Help actions
    helpButton.addEventListener('click', showHelpModal);
    closeHelpBtn.addEventListener('click', hideHelpModal);
}

// Render user buttons
function renderUsers() {
    userButtonsContainer.innerHTML = '';
    
    users.forEach((user, index) => {
        const userButton = document.createElement('button');
        userButton.className = 'user-button';
        userButton.textContent = user.name;
        userButton.addEventListener('click', () => selectUser(index));
        userButtonsContainer.appendChild(userButton);
    });
}

// Select a user and show their tasks
function selectUser(userIndex) {
    currentUser = userIndex;
    usernameSpan.textContent = users[currentUser].name;
    
    // Populate category filter
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    users[currentUser].categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Reset view settings
    showAllTasks = false;
    currentCategoryFilter = 'all';
    activeTab.classList.add('active');
    allTab.classList.remove('active');
    categoryFilter.value = 'all';
    
    // Render tasks and switch screens
    renderTasks();
    userSelectionScreen.classList.add('hidden');
    taskScreen.classList.remove('hidden');
}

// Show user selection screen
function showUserSelection() {
    taskScreen.classList.add('hidden');
    userSelectionScreen.classList.remove('hidden');
}

// Render tasks based on current filters
function renderTasks() {
    taskList.innerHTML = '';
    
    if (currentUser === null) return;
    
    const filteredTasks = users[currentUser].tasks.filter(task => {
        // Filter by status
        if (!showAllTasks && task.status !== 'A') return false;
        
        // Filter by category
        if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) return false;
        
        return true;
    });
    
    // Sort by priority (highest first)
    filteredTasks.sort((a, b) => b.priority - a.priority);
    
    filteredTasks.forEach(task => {
        const taskRow = document.createElement('div');
        taskRow.className = `task-row${task.status === 'F' ? ' finished' : ''}${task.status === 'D' ? ' dropped' : ''}`;
        
        // Columns: Cat, C, U, P, Task, Status, Actions (reordered as requested)
        taskRow.innerHTML = `
            <div class="col">${task.category}</div>
            <div class="col">${task.current}</div>
            <div class="col">${task.ultimate}</div>
            <div class="col">${task.priority}</div>
            <div class="col task-col">${task.description}</div>
            <div class="col">
                <span class="status status-${task.status === 'A' ? 'active' : task.status === 'F' ? 'finished' : 'dropped'}">
                    ${task.status === 'A' ? 'Active' : task.status === 'F' ? 'Finished' : 'Dropped'}
                </span>
            </div>
            <div class="col">
                ${task.status === 'A' ? `
                    <button class="edit-button" data-id="${task.id}">Edit</button>
                    <button class="finish-button" data-id="${task.id}">Finish</button>
                    <button class="drop-button" data-id="${task.id}">Drop</button>
                ` : ''}
            </div>
        `;
        
        taskList.appendChild(taskRow);
    });
    
    // Add event listeners to the task buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editTask(button.dataset.id));
    });
    
    document.querySelectorAll('.finish-button').forEach(button => {
        button.addEventListener('click', () => finishTask(button.dataset.id));
    });
    
    document.querySelectorAll('.drop-button').forEach(button => {
        button.addEventListener('click', () => dropTask(button.dataset.id));
    });
}

// Show modal to add a new task
function showAddTaskModal() {
    // Reset form
    taskForm.reset();
    taskIdInput.value = '';
    taskModalTitle.textContent = 'Add New Task';
    
    // Populate category dropdown
    taskCategorySelect.innerHTML = '';
    users[currentUser].categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        taskCategorySelect.appendChild(option);
    });
    
    addTaskModal.classList.remove('hidden');
}

// Show modal to edit an existing task
function editTask(taskId) {
    const task = users[currentUser].tasks.find(task => task.id === taskId);
    if (!task) return;
    
    // Set form values
    taskIdInput.value = task.id;
    taskDescriptionInput.value = task.description;
    taskCurrentInput.value = task.current;
    taskUltimateInput.value = task.ultimate;
    
    // Populate category dropdown
    taskCategorySelect.innerHTML = '';
    users[currentUser].categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        taskCategorySelect.appendChild(option);
    });
    taskCategorySelect.value = task.category;
    
    taskModalTitle.textContent = 'Edit Task';
    addTaskModal.classList.remove('hidden');
}

// Handle task form submission
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const description = taskDescriptionInput.value.trim();
    const current = parseInt(taskCurrentInput.value);
    const ultimate = parseInt(taskUltimateInput.value);
    const category = taskCategorySelect.value;
    
    // Validate inputs
    if (!description || isNaN(current) || isNaN(ultimate)) return;
    
    const priority = current + ultimate;
    
    if (taskIdInput.value) {
        // Update existing task
        const taskIndex = users[currentUser].tasks.findIndex(task => task.id === taskIdInput.value);
        if (taskIndex !== -1) {
            users[currentUser].tasks[taskIndex] = {
                ...users[currentUser].tasks[taskIndex],
                description,
                current,
                ultimate,
                priority,
                category
            };
        }
    } else {
        // Add new task
        users[currentUser].tasks.push({
            id: generateId(),
            description,
            current,
            ultimate,
            priority,
            category,
            status: 'A'
        });
    }
    
    saveUsers();
    renderTasks();
    hideTaskModal();
}

// Hide task modal
function hideTaskModal() {
    addTaskModal.classList.add('hidden');
}

// Mark a task as finished
function finishTask(taskId) {
    const taskIndex = users[currentUser].tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        users[currentUser].tasks[taskIndex].status = 'F';
        saveUsers();
        renderTasks();
    }
}

// Mark a task as dropped
function dropTask(taskId) {
    const taskIndex = users[currentUser].tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        users[currentUser].tasks[taskIndex].status = 'D';
        saveUsers();
        renderTasks();
    }
}

// Show modal to add a new user
function showAddUserModal() {
    userForm.reset();
    addUserModal.classList.remove('hidden');
}

// Handle user form submission
function handleUserSubmit(e) {
    e.preventDefault();
    
    const username = newUsernameInput.value.trim();
    if (!username) return;
    
    users.push({
        name: username,
        categories: ['Day Job', 'Kids', 'Home', 'Self', 'Other'],
        tasks: getSampleTasks()
    });
    
    saveUsers();
    renderUsers();
    hideUserModal();
    
    // Automatically select the newly created user
    selectUser(users.length - 1);
}

// Hide user modal
function hideUserModal() {
    addUserModal.classList.add('hidden');
}

// Show categories modal
function showCategoriesModal() {
    renderCategories();
    categoriesModal.classList.remove('hidden');
    categoryForm.classList.add('hidden');
}

// Hide categories modal
function hideCategoriesModal() {
    categoriesModal.classList.add('hidden');
}

// Show help modal
function showHelpModal() {
    helpModal.classList.remove('hidden');
}

// Hide help modal
function hideHelpModal() {
    helpModal.classList.add('hidden');
}

// Render categories list
function renderCategories() {
    categoriesList.innerHTML = '';
    
    users[currentUser].categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${category}</span>
            <div class="category-actions">
                <button type="button" class="edit-category" data-index="${index}">Edit</button>
                <button type="button" class="delete-category" data-index="${index}">Delete</button>
            </div>
        `;
        categoriesList.appendChild(li);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', () => editCategory(parseInt(button.dataset.index)));
    });
    
    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', () => deleteCategory(parseInt(button.dataset.index)));
    });
    
    // Show/hide add category button based on limit
    if (users[currentUser].categories.length >= 5) {
        addCategoryBtn.disabled = true;
        addCategoryBtn.textContent = 'Maximum Categories Reached';
    } else {
        addCategoryBtn.disabled = false;
        addCategoryBtn.textContent = '+ Add Category';
    }
}

// Show category form for adding
function showCategoryForm() {
    if (users[currentUser].categories.length >= 5) return;
    
    categoryForm.reset();
    editingCategoryIndex = -1;
    categoryForm.classList.remove('hidden');
}

// Show category form for editing
function editCategory(index) {
    editingCategoryIndex = index;
    categoryNameInput.value = users[currentUser].categories[index];
    categoryForm.classList.remove('hidden');
}

// Hide category form
function hideCategoryForm() {
    categoryForm.classList.add('hidden');
}

// Handle category form submission
function handleCategorySubmit(e) {
    e.preventDefault();
    
    const categoryName = categoryNameInput.value.trim();
    if (!categoryName) return;
    
    if (editingCategoryIndex === -1) {
        // Add new category
        users[currentUser].categories.push(categoryName);
    } else {
        // Edit existing category
        users[currentUser].categories[editingCategoryIndex] = categoryName;
        
        // Update tasks with this category
        users[currentUser].tasks.forEach(task => {
            if (task.category === users[currentUser].categories[editingCategoryIndex]) {
                task.category = categoryName;
            }
        });
    }
    
    saveUsers();
    renderCategories();
    hideCategoryForm();
}

// Delete category
function deleteCategory(index) {
    // Don't allow deleting if it's the last category
    if (users[currentUser].categories.length <= 1) {
        alert('You must have at least one category.');
        return;
    }
    
    const categoryToDelete = users[currentUser].categories[index];
    
    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
        return;
    }
    
    // Find a replacement category for tasks
    const replacementCategory = users[currentUser].categories.find((cat, i) => i !== index);
    
    // Update tasks with this category
    users[currentUser].tasks.forEach(task => {
        if (task.category === categoryToDelete) {
            task.category = replacementCategory;
        }
    });
    
    // Remove the category
    users[currentUser].categories.splice(index, 1);
    
    saveUsers();
    renderCategories();
}

// Generate a unique ID
function generateId() {
    return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);
