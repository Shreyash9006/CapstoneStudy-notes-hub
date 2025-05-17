document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSidebar();
    initializeFilterPanel();
    initializeAIAssistant();
    initializeNoteCardEvents();
    initializeCollections();
});

// Sidebar functionality
function initializeSidebar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        if (navMenu.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== mobileToggle) {
            navMenu.classList.remove('active');
        }
    });
}

// Filter panel functionality
function initializeFilterPanel() {
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    
    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', function() {
            filterPanel.classList.toggle('active');
        });
        
        if (closeFilter) {
            closeFilter.addEventListener('click', function() {
                filterPanel.classList.remove('active');
            });
        }
        
        // Close filter panel when clicking outside
        document.addEventListener('click', function(event) {
            if (filterPanel.classList.contains('active') && 
                !filterPanel.contains(event.target) && 
                event.target !== filterBtn) {
                filterPanel.classList.remove('active');
            }
        });
        
        // Apply filters button functionality
        const applyFiltersBtn = filterPanel.querySelector('.btn-primary');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                applyFilters();
                filterPanel.classList.remove('active');
            });
        }
        
        // Reset filters button functionality
        const resetFiltersBtn = filterPanel.querySelector('.btn-outline');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                resetFilters();
            });
        }
    }
}

// Apply filters to the note list
function applyFilters() {
    const subjectFilter = document.querySelector('.filter-group:nth-child(1) .filter-select').value;
    const typeFilter = document.querySelector('.filter-group:nth-child(2) .filter-select').value;
    const collectionFilter = document.querySelector('.filter-group:nth-child(3) .filter-select').value;
    
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        let showCard = true;
        
        // Check subject filter
        if (subjectFilter && card.querySelector('.note-subject').textContent !== getFullSubjectName(subjectFilter)) {
            showCard = false;
        }
        
        // Check type filter
        if (typeFilter && card.querySelector('.note-type').textContent !== getFullTypeName(typeFilter)) {
            showCard = false;
        }
        
        // For collection filter, we'd need additional data attributes on cards
        // This is a simplified version assuming we have that data
        if (collectionFilter) {
            // This would check against a data attribute like data-collection
            // For now, we'll just simulate this behavior
            const cardCollections = getCardCollections(card);
            if (!cardCollections.includes(collectionFilter)) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
    
    // Show a message if no results
    const noteList = document.querySelector('.note-list');
    const noResultsMsg = document.getElementById('noResultsMsg');
    
    if (!Array.from(noteCards).some(card => card.style.display !== 'none')) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.id = 'noResultsMsg';
            msg.className = 'no-results';
            msg.textContent = 'No notes match your filters';
            noteList.appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Reset all filters to default values
function resetFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Reset the note cards display
    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Remove no results message if present
    const noResultsMsg = document.getElementById('noResultsMsg');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Helper functions for the filters
function getFullSubjectName(shortCode) {
    const subjects = {
        'computer-science': 'Computer Science',
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology'
    };
    return subjects[shortCode] || '';
}

function getFullTypeName(shortCode) {
    const types = {
        'lecture': 'Lecture',
        'summary': 'Summary',
        'cheatsheet': 'Cheat Sheet',
        'exam': 'Exam Prep',
        'tutorial': 'Tutorial'
    };
    return types[shortCode] || '';
}

// This function would normally read data attributes from the card
// For now, we'll simulate with a simple mapping
function getCardCollections(card) {
    const title = card.querySelector('.note-title').textContent;
    
    // Demo mapping based on note titles
    const collectionMap = {
        'Machine Learning Fundamentals': ['finals', 'research'],
        'Differential Equations - Complete Guide': ['finals', 'midterms'],
        'Thermodynamics Laws & Applications': ['midterms'],
        'Organic Chemistry Reactions Catalog': ['important'],
        'Database Systems - SQL Mastery': ['research'],
        'Cell Biology & Genetics': ['important', 'midterms']
    };
    
    return collectionMap[title] || [];
}

// AI Assistant functionality
function initializeAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const aiClose = document.getElementById('aiClose');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiInputField = document.getElementById('aiInputField');
    const aiContent = document.getElementById('aiContent');
    
    if (aiToggle && aiPanel) {
        // Toggle AI panel
        aiToggle.addEventListener('click', function() {
            aiPanel.classList.toggle('active');
            aiToggle.querySelector('.ai-notification').style.display = 'none';
        });
        
        // Close AI panel
        if (aiClose) {
            aiClose.addEventListener('click', function() {
                aiPanel.classList.remove('active');
            });
        }
        
        // Send message functionality
        if (aiSendBtn && aiInputField && aiContent) {
            aiSendBtn.addEventListener('click', function() {
                sendAIMessage();
            });
            
            aiInputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendAIMessage();
                }
            });
            
            // AI suggestion chips functionality
            const aiChips = document.querySelectorAll('.ai-chip');
            aiChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    const chipText = this.textContent;
                    aiInputField.value = chipText;
                    sendAIMessage();
                });
            });
        }
    }
}

// Send message to AI assistant
function sendAIMessage() {
    const aiInputField = document.getElementById('aiInputField');
    const aiContent = document.getElementById('aiContent');
    const message = aiInputField.value.trim();
    
    if (message) {
        // Add user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'user-message';
        userMsgDiv.innerHTML = `
            <div class="user-bubble-message">
                ${message}
            </div>
            <div class="user-avatar">👤</div>
        `;
        aiContent.appendChild(userMsgDiv);
        
        // Clear input field
        aiInputField.value = '';
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
        
        // Simulate AI response after a short delay
        setTimeout(() => {
            simulateAIResponse(message);
        }, 800);
    }
}

// Simulate AI assistant response
function simulateAIResponse(userMessage) {
    const aiContent = document.getElementById('aiContent');
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing';
    typingDiv.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="ai-bubble-message">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    aiContent.appendChild(typingDiv);
    aiContent.scrollTop = aiContent.scrollHeight;
    
    // Generate response based on user message
    let response = '';
    let suggestions = [];
    
    // Simple AI response logic
    if (userMessage.toLowerCase().includes('study plan')) {
        response = "I can help create a study plan! Based on your saved notes, I recommend focusing on Machine Learning and Differential Equations this week. Would you like a detailed schedule?";
        suggestions = ['Create schedule', 'Focus on ML only', 'Focus on Math only'];
    } else if (userMessage.toLowerCase().includes('similar notes')) {
        response = "I found several notes related to your saved collections. There are 3 more highly-rated Machine Learning notes and 2 Differential Equations guides. Would you like me to show them?";
        suggestions = ['Show ML notes', 'Show Math notes', 'Show all recommendations'];
    } else if (userMessage.toLowerCase().includes('quiz')) {
        response = "I'd be happy to quiz you! Which subject would you like to focus on from your saved notes?";
        suggestions = ['Computer Science', 'Mathematics', 'Physics'];
    } else {
        response = "I'm here to help with your study materials. Would you like me to help find specific notes, create a study plan, or quiz you on a topic?";
        suggestions = ['Find notes', 'Create study plan', 'Quiz me'];
    }
    
    // Remove typing indicator after a delay and show response
    setTimeout(() => {
        // Remove typing indicator
        aiContent.removeChild(typingDiv);
        
        // Add AI response
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'ai-message';
        aiMsgDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-bubble-message">
                ${response}
            </div>
        `;
        aiContent.appendChild(aiMsgDiv);
        
        // Add suggestion chips if available
        if (suggestions.length > 0) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'ai-suggestion-chips';
            
            suggestions.forEach(suggestion => {
                const chip = document.createElement('div');
                chip.className = 'ai-chip';
                chip.textContent = suggestion;
                chip.addEventListener('click', function() {
                    document.getElementById('aiInputField').value = this.textContent;
                    sendAIMessage();
                });
                suggestionsDiv.appendChild(chip);
            });
            
            aiContent.appendChild(suggestionsDiv);
        }
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
    }, 1500);
}

// Note card interactions
function initializeNoteCardEvents() {
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        card.addEventListener('click', function() {
            // This would normally navigate to the note details page
            // For demo purposes, we'll just add a visual effect
            this.classList.add('selected');
            setTimeout(() => {
                this.classList.remove('selected');
            }, 300);
            
            // We could also update the recently viewed section
            updateRecentlyViewed(this);
        });
    });
}

// Update recently viewed section
function updateRecentlyViewed(noteCard) {
    // This function would normally make an API call to update the user's history
    // For demo purposes, we'll just log it
    const noteTitle = noteCard.querySelector('.note-title').textContent;
    console.log(`Updated recently viewed: ${noteTitle}`);
}

// Collections functionality
function initializeCollections() {
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            const collectionName = this.querySelector('.subject-name').textContent;
            filterByCollection(collectionName);
        });
    });
}

// Filter notes by collection
function filterByCollection(collectionName) {
    // This would normally update the selected collection in the filter
    // and then call applyFilters()
    console.log(`Filter by collection: ${collectionName}`);
    
    // Find the collection in the filter dropdown and select it
    const collectionSelect = document.querySelector('.filter-group:nth-child(3) .filter-select');
    if (collectionSelect) {
        const options = Array.from(collectionSelect.options);
        const option = options.find(opt => opt.textContent === collectionName);
        
        if (option) {
            collectionSelect.value = option.value;
            applyFilters();
        }
    }
}

// Search functionality for the search bar
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchNotes(searchTerm);
        });
    }
});

// Search notes based on input
function searchNotes(searchTerm) {
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        const noteTitle = card.querySelector('.note-title').textContent.toLowerCase();
        const noteSubject = card.querySelector('.note-subject').textContent.toLowerCase();
        const noteType = card.querySelector('.note-type').textContent.toLowerCase();
        
        // Check if the note matches the search term
        if (noteTitle.includes(searchTerm) || 
            noteSubject.includes(searchTerm) || 
            noteType.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show a message if no results
    const noteList = document.querySelector('.note-list');
    const noResultsMsg = document.getElementById('noSearchResultsMsg');
    
    if (!Array.from(noteCards).some(card => card.style.display !== 'none')) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.id = 'noSearchResultsMsg';
            msg.className = 'no-results';
            msg.textContent = 'No notes match your search';
            noteList.appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Sort notes functionality
document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.querySelector('.header-actions .filter-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortNotes(sortValue);
        });
    }
});

// Sort notes based on selection
function sortNotes(sortBy) {
    const noteList = document.querySelector('.note-list');
    const noteCards = Array.from(noteList.querySelectorAll('.note-card'));
    
    noteCards.sort((a, b) => {
        if (sortBy === 'recent') {
            // Sort by date (assuming the date is in the format "Month Day, Year")
            const dateA = new Date(a.querySelector('.stat:nth-child(3)').textContent.split('💾 ')[1]);
            const dateB = new Date(b.querySelector('.stat:nth-child(3)').textContent.split('💾 ')[1]);
            return dateB - dateA;
        } else if (sortBy === 'name') {
            // Sort by title alphabetically
            const titleA = a.querySelector('.note-title').textContent;
            const titleB = b.querySelector('.note-title').textContent;
            return titleA.localeCompare(titleB);
        } else if (sortBy === 'subject') {
            // Sort by subject
            const subjectA = a.querySelector('.note-subject').textContent;
            const subjectB = b.querySelector('.note-subject').textContent;
            return subjectA.localeCompare(subjectB);
        }
        return 0;
    });
    
    // Remove all note cards from the DOM
    noteCards.forEach(card => {
        noteList.removeChild(card);
    });
    
    // Add them back in the sorted order
    noteCards.forEach(card => {
        noteList.appendChild(card);
    });
}

// Load more notes functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.card .btn-outline');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreNotes();
        });
    }
});

// Load more notes
function loadMoreNotes() {
    const noteList = document.querySelector('.note-list');
    const loadMoreBtn = document.querySelector('.card .btn-outline');
    
    // This would normally make an API call to get more notes
    // For demo purposes, we'll just add some dummy notes
    
    // Add 3 more dummy notes
    for (let i = 0; i < 3; i++) {
        const subjectColors = ['#3a0ca3', '#7209b7', '#f77f00'];
        const subjects = ['Mathematics', 'Physics', 'Computer Science'];
        const types = ['Lecture', 'Summary', 'Cheat Sheet'];
        const titles = [
            'Probability and Statistics',
            'Quantum Mechanics Introduction',
            'Data Structures and Algorithms'
        ];
        const authors = ['Robert Chen', 'Lisa Wong', 'Michael Smith'];
        const dates = ['April 18, 2025', 'April 15, 2025', 'April 10, 2025'];
        
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-header" style="background-color: ${subjectColors[i]};">
                <div class="note-subject">${subjects[i]}</div>
                <div class="note-type">${types[i]}</div>
            </div>
            <div class="note-content">
                <div class="note-title">${titles[i]}</div>
                <div class="note-subject">Course ${300 + i} - Advanced Study</div>
                <div class="note-stats">
                    <div class="stat"><span>👤</span> ${authors[i]}</div>
                    <div class="stat"><span>⭐</span> ${(4.5 + i/10).toFixed(1)}</div>
                    <div class="stat"><span>💾</span> ${dates[i]}</div>
                </div>
            </div>
        `;
        
        // Add click event listener
        noteCard.addEventListener('click', function() {
            this.classList.add('selected');
            setTimeout(() => {
                this.classList.remove('selected');
            }, 300);
            updateRecentlyViewed(this);
        });
        
        noteList.appendChild(noteCard);
    }
    
    // Increment the page counter (could be stored in a data attribute)
    const currentPage = parseInt(loadMoreBtn.getAttribute('data-page') || '1');
    loadMoreBtn.setAttribute('data-page', currentPage + 1);
    
    // Disable the load more button after a few pages
    if (currentPage >= 2) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'No More Notes';
    }
}