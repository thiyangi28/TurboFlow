const API_URL = '/hotwheels';

// DOM Elements
const grid = document.getElementById('hotwheels-grid');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const hotwheelForm = document.getElementById('hotwheel-form');
const addBtn = document.getElementById('addBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Inputs
const idInput = document.getElementById('hw-id');
const titleInput = document.getElementById('hw-title');
const authorInput = document.getElementById('hw-author');
const imageInput = document.getElementById('hw-image');
const categoryInput = document.getElementById('hw-category');

const filterBtns = document.querySelectorAll('.filter-btn');
let allHotWheels = [];

// Initialize
document.addEventListener('DOMContentLoaded', fetchHotWheels);

// Fetch all Data
async function fetchHotWheels() {
    showLoader();
    try {
        const res = await fetch(API_URL);
        allHotWheels = await res.json();
        renderGrid(allHotWheels);
    } catch (error) {
        console.error('Error fetching data:', error);
        grid.innerHTML = '<p style="text-align: center; color: #ff4444; grid-column: 1/-1;">Failed to load data. Make sure backend is running.</p>';
    } finally {
        hideLoader();
    }
}

// Render Grid
function renderGrid(data) {
    grid.innerHTML = '';
    
    if (data.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">No Hot Wheels found. Add your first one!</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${item.imageUrl || '/images/default.png'}')"></div>
            <div class="card-content">
                <div class="category-badge">${item.category || 'Other'}</div>
                <div class="card-header">
                    <div class="card-title">${item.title}</div>
                    <div class="card-actions">
                        <button class="icon-btn edit" onclick="openEditModal('${item._id}', '${item.title}', '${item.author}', '${item.imageUrl || ''}', '${item.category || 'Uncategorized'}')" title="Edit">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="icon-btn delete" onclick="deleteHotWheel('${item._id}')" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>
                <div class="card-author">
                    <i class="ri-user-line"></i> ${item.author}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Form Submit (Add or Edit)
hotwheelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = idInput.value;
    const payload = {
        title: titleInput.value,
        author: authorInput.value,
        imageUrl: imageInput.value,
        category: categoryInput.value
    };

    const isEdit = !!id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeModal();
            fetchHotWheels();
        } else {
            alert('Something went wrong!');
        }
    } catch (error) {
        console.error('Error saving:', error);
    }
});

// Delete Data
async function deleteHotWheel(id) {
    if (confirm('Are you sure you want to delete this model?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                fetchHotWheels();
            } else {
                alert('Failed to delete!');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    }
}

// Modal Controls
addBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Model';
    hotwheelForm.reset();
    idInput.value = '';
    imageInput.value = '';
    categoryInput.value = 'Uncategorized';
    modal.classList.remove('hidden');
});

function openEditModal(id, title, author, imageUrl, category) {
    modalTitle.textContent = 'Edit Model';
    idInput.value = id;
    titleInput.value = title;
    authorInput.value = author;
    imageInput.value = imageUrl;
    categoryInput.value = category;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Loader Utils
function showLoader() {
    loader.classList.remove('hidden');
    grid.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
    grid.classList.remove('hidden');
}

// Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        if (filterValue === 'All') {
            renderGrid(allHotWheels);
        } else {
            const filtered = allHotWheels.filter(hw => hw.category === filterValue);
            renderGrid(filtered);
        }
    });
});
