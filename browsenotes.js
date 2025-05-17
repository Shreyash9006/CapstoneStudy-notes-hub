document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const viewModeBtn = document.getElementById('viewModeBtn');
    const viewModeIcon = document.getElementById('viewModeIcon');
    const viewModeText = document.getElementById('viewModeText');
    const notesGrid = document.getElementById('notesGrid');
    const notesList = document.getElementById('notesList');
    const categoryChips = document.getElementById('categoryChips');
    const moreCategories = document.getElementById('moreCategories');
    const searchInput = document.getElementById('searchInput');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const subjectFilter = document.getElementById('subjectFilter');
    const noteTypeFilter = document.getElementById('noteTypeFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const sortFilter = document.getElementById('sortFilter');
    const activeFilters = document.getElementById('activeFilters');
    const resultsCount = document.getElementById('resultsCount');
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Filter panel toggle
    filterBtn.addEventListener('click', function() {
        filterPanel.classList.toggle('show');
    });
    
    closeFilter.addEventListener('click', function() {
        filterPanel.classList.remove('show');
    });
    
    // View mode toggle (Grid/List)
    let isGridView = true;
    
    viewModeBtn.addEventListener('click', function() {
        isGridView = !isGridView;
        
        if (isGridView) {
            notesGrid.style.display = 'grid';
            notesList.style.display = 'none';
            viewModeIcon.textContent = '📊';
            viewModeText.textContent = 'Grid View';
        } else {
            notesGrid.style.display = 'none';
            notesList.style.display = 'flex';
            viewModeIcon.textContent = '📋';
            viewModeText.textContent = 'List View';
        }
    });
    
    // Category chips selection
    const categoryChipElements = categoryChips.querySelectorAll('.category-chip:not(.more-chip)');
    
    categoryChipElements.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            categoryChipElements.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Filter notes based on selected category
            const selectedCategory = this.getAttribute('data-category');
            filterNotesByCategory(selectedCategory);
        });
    });
    
    // Filter notes by category
    function filterNotesByCategory(category) {
        const noteCards = document.querySelectorAll('.browse-note-card, .note-list-item');
        
        noteCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        updateResultsCount();
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchNotes(searchTerm);
    });
    
    function searchNotes(term) {
        const noteCards = document.querySelectorAll('.browse-note-card, .note-list-item');
        let visibleCount = 0;
        
        noteCards.forEach(card => {
            const title = card.querySelector('.note-title, .note-list-title').textContent.toLowerCase();
            const subtitle = card.querySelector('.note-subtitle, .note-list-subtitle').textContent.toLowerCase();
            const preview = card.querySelector('.note-preview, .note-list-preview').textContent.toLowerCase();
            
            if (title.includes(term) || subtitle.includes(term) || preview.includes(term)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        resultsCount.textContent = `Showing ${visibleCount} results`;
    }
    
    // Filter application
    applyFiltersBtn.addEventListener('click', function() {
        const subject = subjectFilter.value;
        const noteType = noteTypeFilter.value;
        const difficulty = difficultyFilter.value;
        const sort = sortFilter.value;
        
        applyFilters(subject, noteType, difficulty, sort);
        updateActiveFilters(subject, noteType, difficulty);
        filterPanel.classList.remove('show');
    });
    
    function applyFilters(subject, noteType, difficulty, sort) {
        const noteCards = document.querySelectorAll('.browse-note-card, .note-list-item');
        let visibleCount = 0;
        
        noteCards.forEach(card => {
            let visible = true;
            
            if (subject && card.getAttribute('data-category') !== subject) {
                visible = false;
            }
            
            if (noteType && card.getAttribute('data-type') !== noteType) {
                visible = false;
            }
            
            if (difficulty && card.getAttribute('data-level') !== difficulty) {
                visible = false;
            }
            
            card.style.display = visible ? '' : 'none';
            
            if (visible) {
                visibleCount++;
            }
        });
        
        // Sort notes if needed
        if (sort) {
            sortNotes(sort);
        }
        
        // Update results count
        resultsCount.textContent = `Showing ${visibleCount} results`;
    }
    
    // Update active filters display
    function updateActiveFilters(subject, noteType, difficulty) {
        // Clear current active filters
        activeFilters.innerHTML = '';
        
        // Add filter tags if filters are applied
        if (subject) {
            const subjectText = subjectFilter.options[subjectFilter.selectedIndex].text;
            addFilterTag(subjectText);
        }
        
        if (noteType) {
            const noteTypeText = noteTypeFilter.options[noteTypeFilter.selectedIndex].text;
            addFilterTag(noteTypeText);
        }
        
        if (difficulty) {
            const difficultyText = difficultyFilter.options[difficultyFilter.selectedIndex].text;
            addFilterTag(difficultyText);
        }
        
        // Add clear all button if any filters are applied
        if (subject || noteType || difficulty) {
            const clearAll = document.createElement('div');
            clearAll.className = 'clear-all';
            clearAll.textContent = 'Clear All';
            clearAll.addEventListener('click', resetFilters);
            activeFilters.appendChild(clearAll);
        }
    }
    
    function addFilterTag(text) {
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `${text} <span class="remove-filter">×</span>`;
        
        const removeBtn = filterTag.querySelector('.remove-filter');
        removeBtn.addEventListener('click', function() {
            filterTag.remove();
            
            // Check if there are no more filter tags
            if (activeFilters.querySelectorAll('.filter-tag').length === 0) {
                activeFilters.innerHTML = '';
                resetFilters();
            }
        });
        
        activeFilters.appendChild(filterTag);
    }
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    function resetFilters() {
        subjectFilter.value = '';
        noteTypeFilter.value = '';
        difficultyFilter.value = '';
        sortFilter.value = 'recent';
        
        // Clear active filters display
        activeFilters.innerHTML = '';
        
        // Show all notes
        const noteCards = document.querySelectorAll('.browse-note-card, .note-list-item');
        noteCards.forEach(card => {
            card.style.display = '';
        });
        
        // Reset category chips
        categoryChipElements.forEach(chip => {
            chip.classList.remove('active');
            if (chip.getAttribute('data-category') === 'all') {
                chip.classList.add('active');
            }
        });
        
        // Update results count
        updateResultsCount();
    }
    
    // Sort notes
    function sortNotes(sortOption) {
        const notesContainer = isGridView ? notesGrid : notesList;
        const noteCards = Array.from(notesContainer.children);
        
        noteCards.sort((a, b) => {
            if (sortOption === 'rating') {
                const ratingA = parseFloat(a.querySelector('.stat:nth-child(2)').textContent.replace('⭐', ''));
                const ratingB = parseFloat(b.querySelector('.stat:nth-child(2)').textContent.replace('⭐', ''));
                return ratingB - ratingA;
            } else if (sortOption === 'popular') {
                const viewsA = parseInt(a.querySelector('.stat:nth-child(1)').textContent.replace('👁️', '').replace('k', '000'));
                const viewsB = parseInt(b.querySelector('.stat:nth-child(1)').textContent.replace('👁️', '').replace('k', '000'));
                return viewsB - viewsA;
            }
            // Default: sort by recent (already in the right order in our HTML)
            return 0;
        });
        
        // Re-append sorted notes
        noteCards.forEach(card => {
            notesContainer.appendChild(card);
        });
    }
    
    // Update results count
    function updateResultsCount() {
        const visibleGridCards = Array.from(notesGrid.children).filter(card => card.style.display !== 'none').length;
        const visibleListCards = Array.from(notesList.children).filter(card => card.style.display !== 'none').length;
        const visibleCount = isGridView ? visibleGridCards : visibleListCards;
        
        resultsCount.textContent = `Showing ${visibleCount} results`;
    }
    
    // Save note functionality
    const saveButtons = document.querySelectorAll('.note-save-btn, .note-list-actions button:nth-child(2)');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('saved');
            if (this.classList.contains('saved')) {
                this.innerHTML = '<span>⭐</span> Saved';
            } else {
                this.innerHTML = '<span>⭐</span> Save';
            }
        });
    });
    
    // AI Assistant Panel
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const aiClose = document.getElementById('aiClose');
    const aiInputField = document.getElementById('aiInputField');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiContent = document.getElementById('aiContent');
    const aiChips = document.querySelectorAll('.ai-chip');
    
    aiToggle.addEventListener('click', function() {
        aiPanel.classList.toggle('show');
        // Remove notification when opened
        const notification = this.querySelector('.ai-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    });
    
    aiClose.addEventListener('click', function() {
        aiPanel.classList.remove('show');
    });
    
    aiSendBtn.addEventListener('click', sendAiMessage);
    
    aiInputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAiMessage();
        }
    });
    
    aiChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const message = this.textContent;
            aiInputField.value = message;
            sendAiMessage();
        });
    });
    
    function sendAiMessage() {
        const message = aiInputField.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="user-bubble-message">${message}</div>
        `;
        aiContent.appendChild(userMessage);
        
        // Clear input
        aiInputField.value = '';
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
        
        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiResponse = document.createElement('div');
            aiResponse.className = 'ai-message';
            
            // Generate response based on message
            let responseText = '';
            if (message.toLowerCase().includes('cs') || message.toLowerCase().includes('computer science')) {
                responseText = 'Here are some top Computer Science notes I found: "Data Structures & Algorithms", "Web Development Fundamentals", and "Object-Oriented Programming Principles". Would you like me to filter for a specific CS topic?';
            } else if (message.toLowerCase().includes('math') || message.toLowerCase().includes('mathematics')) {
                responseText = 'I found several beginner-friendly math notes: "Calculus Fundamentals", "Linear Algebra Basics", and "Discrete Mathematics". Would you like to see more detailed notes on any of these topics?';
            } else if (message.toLowerCase().includes('physics') || message.toLowerCase().includes('cheat sheet')) {
                responseText = 'The most popular physics cheat sheets are "Thermodynamics", "Mechanics Formulas", and "Electromagnetism Quick Reference". Would you like me to send these to your saved notes?';
            } else {
                responseText = 'I\'ll help you find the study materials you need. Could you tell me more about the subject or topic you\'re interested in? Or would you like me to recommend the highest-rated notes?';
            }
            
            aiResponse.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-bubble-message">
                    ${responseText}
                </div>
            `;
            aiContent.appendChild(aiResponse);
            
            // Add follow-up suggestion chips if appropriate
            if (message.toLowerCase().includes('cs') || message.toLowerCase().includes('computer')) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'ai-suggestion-chips';
                suggestionsDiv.innerHTML = `
                    <div class="ai-chip">Algorithms notes</div>
                    <div class="ai-chip">Programming basics</div>
                    <div class="ai-chip">Advanced CS topics</div>
                `;
                aiContent.appendChild(suggestionsDiv);
                
                // Add event listeners to new chips
                suggestionsDiv.querySelectorAll('.ai-chip').forEach(chip => {
                    chip.addEventListener('click', function() {
                        aiInputField.value = this.textContent;
                        sendAiMessage();
                    });
                });
            }
            
            // Scroll to bottom
            aiContent.scrollTop = aiContent.scrollHeight;
        }, 1000);
    }
    
    // Initialize with grid view
    notesGrid.style.display = 'grid';
    notesList.style.display = 'none';
    
    // Set initial results count
    updateResultsCount();
});
