/**
 * StudyNotes Hub - Trending Page JavaScript
 * This file handles all interactive functionality for the trending page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const categoryTags = document.querySelectorAll('.category-tag');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const notesContainer = document.getElementById('notesContainer');
    const searchInput = document.getElementById('searchInput');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const aiClose = document.getElementById('aiClose');
    const aiInputField = document.getElementById('aiInputField');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiContent = document.getElementById('aiContent');
    const aiChips = document.querySelectorAll('.ai-chip');

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Filter panel toggle
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            filterPanel.classList.toggle('active');
        });
    }

    // Close filter panel
    if (closeFilter) {
        closeFilter.addEventListener('click', function() {
            filterPanel.classList.remove('active');
        });
    }

    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Get filter values
            const timeFilter = document.getElementById('timeFilter').value;
            const subjectFilter = document.getElementById('subjectFilter').value;
            const typeFilter = document.getElementById('typeFilter').value;
            const difficultyFilter = document.getElementById('difficultyFilter').value;
            const sortFilter = document.getElementById('sortFilter').value;
            
            // Apply filters (in a real app this would fetch filtered data)
            console.log('Applying filters:', {
                time: timeFilter,
                subject: subjectFilter,
                type: typeFilter,
                difficulty: difficultyFilter,
                sort: sortFilter
            });
            
            // Simulate filtering with a loading state
            notesContainer.innerHTML = '<div class="loading-spinner">Loading...</div>';
            
            // Simulate API delay
            setTimeout(() => {
                // For demo, just reload the original content
                loadNotes();
                filterPanel.classList.remove('active');
            }, 800);
        });
    }

    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('timeFilter').value = 'week';
            document.getElementById('subjectFilter').value = '';
            document.getElementById('typeFilter').value = '';
            document.getElementById('difficultyFilter').value = '';
            document.getElementById('sortFilter').value = 'popular';
        });
    }

    // Category tag selection
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            categoryTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter notes by category (in a real app)
            console.log('Filtering by category:', category);
            
            // Simulate filtering with loading state
            notesContainer.innerHTML = '<div class="loading-spinner">Loading...</div>';
            
            // Simulate API delay
            setTimeout(() => {
                loadNotes(category);
            }, 500);
        });
    });

    // View toggle (Grid/List)
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            notesContainer.classList.remove('list-view');
            notesContainer.classList.add('grid-view');
        });
        
        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            notesContainer.classList.remove('grid-view');
            notesContainer.classList.add('list-view');
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            
            if (query.length > 2) {
                // Perform search (in a real app this would query an API)
                console.log('Searching for:', query);
                
                // Simulate search with loading state
                notesContainer.innerHTML = '<div class="loading-spinner">Searching...</div>';
                
                // Simulate API delay
                setTimeout(() => {
                    loadNotes();
                }, 500);
            } else if (query.length === 0) {
                // Reset to default view when search is cleared
                loadNotes();
            }
        }, 300));
    }

    // Load more notes button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading indicator
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // In a real app, this would load additional notes from an API
                // For demo, we'll just duplicate existing notes
                loadAdditionalNotes();
                
                // Reset button
                loadMoreBtn.textContent = 'Load More';
                loadMoreBtn.disabled = false;
            }, 1000);
        });
    }

    // AI Assistant toggle
    if (aiToggle) {
        aiToggle.addEventListener('click', function() {
            aiPanel.classList.toggle('active');
        });
    }

    // Close AI panel
    if (aiClose) {
        aiClose.addEventListener('click', function() {
            aiPanel.classList.remove('active');
        });
    }

    // AI Send message functionality
    if (aiSendBtn && aiInputField) {
        aiSendBtn.addEventListener('click', function() {
            sendAiMessage();
        });
        
        aiInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAiMessage();
            }
        });
    }

    // AI suggestion chips
    if (aiChips) {
        aiChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const chipText = this.textContent;
                
                // Add user message
                addUserMessage(chipText);
                
                // Generate AI response based on chip
                setTimeout(() => {
                    let aiResponse = '';
                    
                    if (chipText.includes('Recommend')) {
                        aiResponse = "Based on your Computer Science major and recent activity, I'd recommend 'Machine Learning: From Basics to Advanced' by Sarah Williams and 'Data Structures Quick Reference' by John Smith. Would you like to view either of these notes?";
                    } else if (chipText.includes('Filter')) {
                        aiResponse = "I've applied a filter for Computer Science subjects. Would you like to narrow down by difficulty level or note type as well?";
                    } else if (chipText.includes('popular')) {
                        aiResponse = "The most popular notes this week are 'Machine Learning: From Basics to Advanced' with 4.8k views, 'Calculus Made Simple' with 3.2k views, and 'Organic Chemistry Reaction Guide' with 2.8k views. Would you like details on any of these?";
                    }
                    
                    addAiMessage(aiResponse);
                }, 600);
            });
        });
    }

    // Helper functions
    function sendAiMessage() {
        const message = aiInputField.value.trim();
        
        if (message !== '') {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input field
            aiInputField.value = '';
            
            // Simulate AI thinking...
            setTimeout(() => {
                let aiResponse = "I understand you're looking for information about '" + message + "'. Based on trending notes, I can recommend a few relevant resources. Would you like me to filter the trending notes by this topic?";
                
                // Add AI response
                addAiMessage(aiResponse);
            }, 800);
        }
    }

    function addUserMessage(message) {
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="user-bubble-message">${message}</div>
        `;
        aiContent.appendChild(userMessage);
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
    }

    function addAiMessage(message) {
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-bubble-message">${message}</div>
        `;
        aiContent.appendChild(aiMessage);
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
    }

    function loadNotes(category = 'all') {
        // In a real app, this would fetch notes from an API
        // For demo purposes, we're just restoring the original HTML
        
        // This is a placeholder. In a real implementation, you would 
        // have an API call here to fetch notes based on filters
        console.log('Loading notes for category:', category);
        
        // We'll simulate a successful load for the demo
        // In reality, you would use the returned data to populate the container
    }

    function loadAdditionalNotes() {
        // In a real app, this would load more notes from an API
        // For demo, we'll just clone some existing notes
        const notes = document.querySelectorAll('.trending-note-card');
        const notesToClone = Array.from(notes).slice(0, 4); // Clone first 4 notes
        
        notesToClone.forEach(note => {
            const clone = note.cloneNode(true);
            // Change the ranking number for the cloned notes
            const rankElement = clone.querySelector('.trending-rank');
            if (rankElement) {
                const currentCount = document.querySelectorAll('.trending-note-card').length;
                rankElement.textContent = `#${currentCount + 1}`;
            }
            notesContainer.appendChild(clone);
        });
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize any components if needed
    function init() {
        // Any initialization code can go here
    }

    // Run initialization
    init();
});
