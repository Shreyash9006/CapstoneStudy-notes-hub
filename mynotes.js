/**
 * My Notes Page JavaScript
 * Handles notes display, filtering, modals, and AI assistant functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFilterPanel();
    initAIAssistant();
    initNoteTabs();
    initViewToggle();
    initSearchFunctionality();
    initNoteCards();
    initCreateNoteModal();
    initLoadMoreButton();
});

/**
 * Mobile navigation toggle functionality
 */
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * Filter panel toggle functionality
 */
function initFilterPanel() {
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    
    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', function() {
            filterPanel.classList.toggle('active');
        });
    }
    
    if (closeFilter && filterPanel) {
        closeFilter.addEventListener('click', function() {
            filterPanel.classList.remove('active');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('subjectFilter').value = '';
            document.getElementById('typeFilter').value = '';
            document.getElementById('sortFilter').value = 'recent';
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
            filterPanel.classList.remove('active');
        });
    }
}

/**
 * Apply filters to the notes grid
 */
function applyFilters() {
    const subjectFilter = document.getElementById('subjectFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const noteItems = document.querySelectorAll('.note-item');
    
    noteItems.forEach(item => {
        let show = true;
        
        // Subject filtering
        if (subjectFilter && item.dataset.subject !== subjectFilter) {
            show = false;
        }
        
        // Type filtering
        if (typeFilter && item.dataset.type !== typeFilter) {
            show = false;
        }
        
        // Show/hide based on filters
        if (show) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Sorting functionality
    const notesGrid = document.getElementById('notesGrid');
    const notesArray = Array.from(noteItems).filter(item => item.style.display !== 'none');
    
    if (sortFilter === 'popular') {
        notesArray.sort((a, b) => {
            const viewsA = parseInt(a.querySelector('.stat:first-child').textContent.match(/\d+/)[0]);
            const viewsB = parseInt(b.querySelector('.stat:first-child').textContent.match(/\d+/)[0]);
            return viewsB - viewsA;
        });
    } else if (sortFilter === 'rating') {
        notesArray.sort((a, b) => {
            const ratingA = parseFloat(a.querySelector('.stat:nth-child(2)').textContent.match(/\d+\.\d+/)[0]);
            const ratingB = parseFloat(b.querySelector('.stat:nth-child(2)').textContent.match(/\d+\.\d+/)[0]);
            return ratingB - ratingA;
        });
    } else {
        // Sort by recent (default)
        notesArray.sort((a, b) => {
            const dateA = new Date(a.querySelector('.note-date').textContent);
            const dateB = new Date(b.querySelector('.note-date').textContent);
            return dateB - dateA;
        });
    }
    
    // Re-add sorted items to the grid
    notesArray.forEach(item => {
        notesGrid.appendChild(item);
    });
}

/**
 * Tab navigation for notes categories
 */
function initNoteTabs() {
    const tabs = document.querySelectorAll('.notes-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter notes based on tab
            const tabType = this.dataset.tab;
            filterNotesByTab(tabType);
        });
    });
}

/**
 * Filter notes based on selected tab
 */
function filterNotesByTab(tabType) {
    const noteItems = document.querySelectorAll('.note-item');
    
    noteItems.forEach(item => {
        if (tabType === 'all') {
            item.style.display = 'flex';
        } else if (tabType === 'public') {
            const isPublic = item.querySelector('.note-badge:nth-child(2)').textContent === 'Public';
            item.style.display = isPublic ? 'flex' : 'none';
        } else if (tabType === 'private') {
            const isPrivate = item.querySelector('.note-badge:nth-child(2)').textContent === 'Private';
            item.style.display = isPrivate ? 'flex' : 'none';
        } else if (tabType === 'favorites') {
            // Implement favorites logic (for demonstration, we'll just show some random notes)
            const random = Math.random() > 0.5;
            item.style.display = random ? 'flex' : 'none';
        } else if (tabType === 'archived') {
            // Implement archived logic (for demonstration, we'll show a small subset)
            const isArchivedIndex = Array.from(noteItems).indexOf(item);
            item.style.display = isArchivedIndex < 2 ? 'flex' : 'none';
        }
    });
}

/**
 * View toggle between grid and list views
 */
function initViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const notesGrid = document.getElementById('notesGrid');
    
    if (gridViewBtn && listViewBtn && notesGrid) {
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            notesGrid.classList.remove('list-view');
            notesGrid.classList.add('grid-view');
        });
        
        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            notesGrid.classList.remove('grid-view');
            notesGrid.classList.add('list-view');
        });
    }
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('notesSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const noteItems = document.querySelectorAll('.note-item');
            
            noteItems.forEach(item => {
                const title = item.querySelector('.note-title').textContent.toLowerCase();
                const subject = item.querySelector('.note-subject').textContent.toLowerCase();
                const preview = item.querySelector('.note-preview').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || subject.includes(searchTerm) || preview.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Note cards click events
 */
function initNoteCards() {
    const noteItems = document.querySelectorAll('.note-item');
    const noteActionBtns = document.querySelectorAll('.note-action-btn');
    
    noteItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Exclude clicks on action buttons
            if (!e.target.closest('.note-actions')) {
                // In a real app, this would navigate to the note details page
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
            }
        });
    });
    
    // Handle note action buttons
    noteActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the note item click
            
            const actionType = this.getAttribute('title');
            const noteTitle = this.closest('.note-item').querySelector('.note-title').textContent;
            
            if (actionType === 'Edit') {
                // Open edit modal (for demonstration, we'll use the create modal)
                const modal = document.getElementById('createNoteModal');
                document.getElementById('noteTitle').value = noteTitle;
                modal.classList.add('active');
            } else if (actionType === 'Share') {
                // Show share options (for demonstration, just log to console)
                console.log(`Sharing note: ${noteTitle}`);
                alert(`Sharing options for: ${noteTitle}`);
            } else if (actionType === 'More') {
                // Show more options (for demonstration, just log to console)
                console.log(`More options for: ${noteTitle}`);
            }
        });
    });
}

/**
 * Create note modal functionality
 */
function initCreateNoteModal() {
    const createNoteBtn = document.getElementById('createNoteBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const modal = document.getElementById('createNoteModal');
    const fileInput = document.getElementById('noteAttachment');
    const fileInfo = document.querySelector('.file-info');
    
    if (createNoteBtn && modal) {
        createNoteBtn.addEventListener('click', function() {
            modal.classList.add('active');
            resetModalForm();
        });
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (cancelNoteBtn && modal) {
        cancelNoteBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', function() {
            saveNewNote();
            modal.classList.remove('active');
        });
    }
    
    // File input change event
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileInfo.textContent = this.files[0].name;
            } else {
                fileInfo.textContent = 'No file chosen';
            }
        });
    }
}

/**
 * Reset modal form fields
 */
function resetModalForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteSubject').value = '';
    document.getElementById('noteType').value = '';
    document.getElementById('noteVisibility').value = 'public';
    document.getElementById('noteContent').value = '';
    document.querySelector('.file-info').textContent = 'No file chosen';
}

/**
 * Save new note
 */
function saveNewNote() {
    const title = document.getElementById('noteTitle').value;
    const subject = document.getElementById('noteSubject').value;
    const type = document.getElementById('noteType').value;
    const visibility = document.getElementById('noteVisibility').value;
    const content = document.getElementById('noteContent').value;
    
    if (!title || !subject || !type) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Create new note card
    const notesGrid = document.getElementById('notesGrid');
    
    // Get color based on subject
    let bgColor = 'var(--primary)';
    if (subject === 'mathematics') bgColor = 'var(--accent)';
    if (subject === 'physics') bgColor = 'var(--warning)';
    if (subject === 'chemistry') bgColor = '#10b981';
    if (subject === 'biology') bgColor = '#8b5cf6';
    
    // Format type text
    let typeText = 'Lecture';
    if (type === 'summary') typeText = 'Summary';
    if (type === 'cheatsheet') typeText = 'Cheat Sheet';
    if (type === 'exam') typeText = 'Exam Prep';
    
    // Format subject text
    let subjectText = 'Computer Science';
    if (subject === 'mathematics') subjectText = 'Mathematics';
    if (subject === 'physics') subjectText = 'Physics';
    if (subject === 'chemistry') subjectText = 'Chemistry';
    if (subject === 'biology') subjectText = 'Biology';
    
    // Create new note HTML
    const newNoteHTML = `
        <div class="note-item" data-subject="${subject}" data-type="${type}">
            <div class="note-header" style="background-color: ${bgColor};">
                <div class="note-actions">
                    <button class="note-action-btn" title="Edit"><span>✏️</span></button>
                    <button class="note-action-btn" title="Share"><span>📤</span></button>
                    <button class="note-action-btn" title="More"><span>⋮</span></button>
                </div>
            </div>
            <div class="note-body">
                <div class="note-title">${title}</div>
                <div class="note-subject">${subjectText}</div>
                <div class="note-badges">
                    <span class="note-badge">${typeText}</span>
                    <span class="note-badge">${visibility === 'public' ? 'Public' : 'Private'}</span>
                </div>
                <div class="note-preview">
                    ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}
                </div>
            </div>
            <div class="note-footer">
                <div class="note-stats">
                    <div class="stat"><span>👁️</span> 0</div>
                    <div class="stat"><span>⭐</span> 0</div>
                    <div class="stat"><span>💬</span> 0</div>
                </div>
                <div class="note-date">${getCurrentDate()}</div>
            </div>
        </div>
    `;
    
    // Add new note to grid
    if (notesGrid) {
        notesGrid.insertAdjacentHTML('afterbegin', newNoteHTML);
        
        // Update total notes count
        updateNotesCount();
        
        // Re-initialize note cards to add event listeners to the new card
        initNoteCards();
    }
    
    // Show success message
    alert('Note created successfully!');
}

/**
 * Update notes count in the statistics
 */
function updateNotesCount() {
    const noteItems = document.querySelectorAll('.note-item');
    const totalNotesElement = document.querySelector('.notes-stat-value');
    
    if (totalNotesElement) {
        totalNotesElement.textContent = noteItems.length;
    }
    
    // Update tab counts
    const allNotesTab = document.querySelector('.tab[data-tab="all"]');
    if (allNotesTab) {
        allNotesTab.textContent = `All Notes (${noteItems.length})`;
    }
}

/**
 * Get current date in formatted string
 */
function getCurrentDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

/**
 * Initialize load more button
 */
function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // For demonstration, we'll add 3 more notes
            loadMoreNotes();
        });
    }
}

/**
 * Load more notes (for demonstration)
 */
function loadMoreNotes() {
    const notesGrid = document.getElementById('notesGrid');
    
    if (!notesGrid) return;
    
    // Sample additional notes (in a real app, these would come from an API)
    const additionalNotes = [
        {
            subject: 'biology',
            type: 'lecture',
            title: 'Cell Biology Foundations',
            subjectText: 'Biology • BIO201',
            typeText: 'Lecture',
            visibility: 'Public',
            preview: 'Cell structure, organelles, cellular respiration, and photosynthesis...',
            bgColor: '#8b5cf6',
            views: 45,
            rating: 4.2,
            comments: 3,
            date: 'March 28, 2025'
        },
        {
            subject: 'computer-science',
            type: 'summary',
            title: 'Database Systems',
            subjectText: 'Computer Science • CS310',
            typeText: 'Summary',
            visibility: 'Private',
            preview: 'SQL queries, database normalization, indexing, and transactions...',
            bgColor: 'var(--primary)',
            views: 0,
            rating: 0,
            comments: 0,
            date: 'March 22, 2025'
        },
        {
            subject: 'mathematics',
            type: 'cheatsheet',
            title: 'Calculus Formulas',
            subjectText: 'Mathematics • MATH210',
            typeText: 'Cheat Sheet',
            visibility: 'Public',
            preview: 'Derivatives, integrals, series, and multivariable calculus formulas...',
            bgColor: 'var(--accent)',
            views: 112,
            rating: 4.8,
            comments: 14,
            date: 'March 15, 2025'
        }
    ];
    
    // Add additional notes to the grid
    additionalNotes.forEach(note => {
        const noteHTML = `
            <div class="note-item" data-subject="${note.subject}" data-type="${note.type}">
                <div class="note-header" style="background-color: ${note.bgColor};">
                    <div class="note-actions">
                        <button class="note-action-btn" title="Edit"><span>✏️</span></button>
                        <button class="note-action-btn" title="Share"><span>📤</span></button>
                        <button class="note-action-btn" title="More"><span>⋮</span></button>
                    </div>
                </div>
                <div class="note-body">
                    <div class="note-title">${note.title}</div>
                    <div class="note-subject">${note.subjectText}</div>
                    <div class="note-badges">
                        <span class="note-badge">${note.typeText}</span>
                        <span class="note-badge">${note.visibility}</span>
                    </div>
                    <div class="note-preview">
                        ${note.preview}
                    </div>
                </div>
                <div class="note-footer">
                    <div class="note-stats">
                        <div class="stat"><span>👁️</span> ${note.views}</div>
                        <div class="stat"><span>⭐</span> ${note.rating}</div>
                        <div class="stat"><span>💬</span> ${note.comments}</div>
                    </div>
                    <div class="note-date">${note.date}</div>
                </div>
            </div>
        `;
        
        notesGrid.insertAdjacentHTML('beforeend', noteHTML);
    });
    
    // Re-initialize note cards to add event listeners to the new cards
    initNoteCards();
    
    // Update notes count
    updateNotesCount();
    
    // Show a message
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.textContent = 'All Notes Loaded';
    loadMoreBtn.disabled = true;
}

// AI ASSISTANT FUNCTIONALITY
// Store conversation history
let conversationHistory = [];

/**
 * Initialize the AI assistant panel and events
 */
function initAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const aiClose = document.getElementById('aiClose');
    const aiInputField = document.getElementById('aiInputField');
    const aiSendBtn = document.getElementById('aiSendBtn');
    
    // Toggle AI panel
    if (aiToggle && aiPanel) {
        aiToggle.addEventListener('click', function() {
            toggleAIPanel();
        });
    }
    
    // Close AI panel
    if (aiClose && aiPanel) {
        aiClose.addEventListener('click', function() {
            aiPanel.classList.remove('active');
        });
    }
    
    // AI Message sending functionality
    if (aiSendBtn && aiInputField) {
        aiSendBtn.addEventListener('click', sendAiMessage);
        aiInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAiMessage();
            }
        });
    }
    
    // Initialize suggestion chips
    initSuggestionChips();
}

/**
 * Toggle AI panel and handle notification
 */
function toggleAIPanel() {
    const aiPanel = document.getElementById('aiPanel');
    const aiInputField = document.getElementById('aiInputField');
    
    if (!aiPanel) return;
    
    aiPanel.classList.toggle('active');
    
    // Remove notification when opened
    const aiNotification = document.querySelector('.ai-notification');
    if (aiNotification) {
        aiNotification.style.display = 'none';
    }
    
    // Focus on input field when panel opens
    if (aiPanel.classList.contains('active') && aiInputField) {
        aiInputField.focus();
    }
}

/**
 * Handle sending user messages
 */
function sendAiMessage() {
    const aiInputField = document.getElementById('aiInputField');
    const aiContent = document.getElementById('aiContent');
    
    if (!aiInputField || !aiContent) return;
    
    const message = aiInputField.value.trim();
    if (message) {
        // Add user message to UI
        displayUserMessage(message);
        
        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message });
        
        // Clear input field
        aiInputField.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate and display AI response
        setTimeout(() => {
            generateAIResponse(message);
        }, 1000 + Math.random() * 1000); // Random delay for more natural feel
    }
}

/**
 * Display user message in the chat
 */
function displayUserMessage(message) {
    const aiContent = document.getElementById('aiContent');
    if (!aiContent) return;
    
    const userMessageHTML = `
        <div class="ai-message user-message">
            <div class="ai-bubble-message user-bubble">
                ${formatMessage(message)}
            </div>
            <div class="ai-avatar user-avatar">JS</div>
        </div>
    `;
    aiContent.insertAdjacentHTML('beforeend', userMessageHTML);
    aiContent.scrollTop = aiContent.scrollHeight;
}

/**
 * Display AI message in the chat
 */
function displayAIMessage(message) {
    const aiContent = document.getElementById('aiContent');
    if (!aiContent) return;
    
    const aiResponseHTML = `
        <div class="ai-message">
            <div class="ai-avatar">🤖</div>
            <div class="ai-bubble-message">
                ${formatMessage(message)}
            </div>
        </div>
    `;
    aiContent.insertAdjacentHTML('beforeend', aiResponseHTML);
    aiContent.scrollTop = aiContent.scrollHeight;
}

/**
 * Format message with markdown-like syntax
 */
function formatMessage(text) {
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Bold text using ** or __
    text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Italic text using * or _
    text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    // Handle lists with - or *
    text = text.replace(/^- (.*?)$/gm, '• $1');
    
    return text;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const aiContent = document.getElementById('aiContent');
    if (!aiContent) return;
    
    const typingHTML = `
        <div class="ai-message" id="typingIndicator">
            <div class="ai-avatar">🤖</div>
            <div class="ai-bubble-message typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    aiContent.insertAdjacentHTML('beforeend', typingHTML);
    aiContent.scrollTop = aiContent.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}
