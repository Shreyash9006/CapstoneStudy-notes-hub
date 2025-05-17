
// Script to handle navigation between pages
document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#dashboard') {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });
    });
    
    // Cancel button click handler
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // File upload handling
    const fileDropArea = document.getElementById('fileDropArea');
    const fileInput = document.getElementById('fileInput');
    const selectedFileContainer = document.getElementById('selectedFile');
    
    if (fileDropArea && fileInput) {
        fileDropArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFileSelect);
        
        fileDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropArea.classList.add('active');
        });
        
        fileDropArea.addEventListener('dragleave', () => {
            fileDropArea.classList.remove('active');
        });
        
        fileDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropArea.classList.remove('active');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });
    }
    
    function handleFileSelect() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            selectedFileContainer.innerHTML = `
                <div class="selected-file">
                    <span>📄</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-remove" onclick="removeFile(event)">✕</span>
                </div>
            `;
            fileDropArea.style.display = 'none';
        }
    }
    
    // Tag input handling
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');
    
    if (tagInput) {
        tagInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const tag = this.value.trim();
                
                if (tag && !tag.includes(',')) {
                    addTag(tag);
                    this.value = '';
                }
            }
        });
    }
    
    // Form submission
    const uploadForm = document.getElementById('uploadForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success notification
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <span class="toast-icon">✓</span>
                <span class="toast-message">Notes uploaded successfully!</span>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                    window.location.href = 'index.html';
                }, 300);
            }, 3000);
        });
    }
});

// Function to remove file
function removeFile(event) {
    event.stopPropagation();
    document.getElementById('fileInput').value = '';
    document.getElementById('selectedFile').innerHTML = '';
    document.getElementById('fileDropArea').style.display = 'block';
}

// Function to add tag
function addTag(text) {
    const tagContainer = document.getElementById('tagContainer');
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.innerHTML = `
        ${text}
        <span class="tag-remove" onclick="removeTag(this)">✕</span>
    `;
    tagContainer.insertBefore(tagElement, document.getElementById('tagInput'));
}

// Function to remove tag
function removeTag(element) {
    element.parentElement.remove();
}