/**
 * Study Platform JavaScript
 * Handles navigation, filters, study plan tracking, and AI assistant functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFilterPanel();
    initAIAssistant();
    initStudyPlanTracking();
    initNoteCards();
    initQuickActionButtons();
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
}

/**
 * Study plan tracking functionality
 */
function initStudyPlanTracking() {
    const sessionChecks = document.querySelectorAll('.session-check:not(.completed)');
    
    sessionChecks.forEach(check => {
        check.addEventListener('click', function() {
            this.classList.toggle('completed');
            this.textContent = this.classList.contains('completed') ? '✓' : '';
            
            // Update progress bar
            updateStudyProgress();
        });
    });
    
    // Initialize the progress bar on page load
    updateStudyProgress();
}

/**
 * Update study progress calculations
 */
function updateStudyProgress() {
    const totalSessions = document.querySelectorAll('.session-check').length;
    const completedSessions = document.querySelectorAll('.session-check.completed').length;
    
    if (totalSessions === 0) return; // Prevent division by zero
    
    const progressPercentage = (completedSessions / totalSessions) * 100;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Update text
    const progressText = document.querySelector('.study-plan-header div:last-child');
    if (progressText) {
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }
}

/**
 * Note card click events
 */
function initNoteCards() {
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would navigate to the note details page
            // For now, just add a simple animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });
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
    
    // Display welcome message
    setTimeout(() => {
        const welcomeMessage = "Hello! I'm your study assistant. How can I help you today?";
        displayAIMessage(welcomeMessage);
    }, 500);
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

/**
 * Generate AI response based on user input
 */
function generateAIResponse(message) {
    // Remove typing indicator
    removeTypingIndicator();
    
    // Get response based on user message and context
    const response = getContextualResponse(message);
    
    // Add to conversation history
    conversationHistory.push({ role: 'assistant', content: response });
    
    // Display the response
    displayAIMessage(response);
    
    // Update suggestion chips based on conversation
    updateSuggestionChips(message, response);
}

/**
 * Get contextual response based on message and conversation history
 */
function getContextualResponse(message) {
    // Convert to lowercase for easier matching
    message = message.toLowerCase();
    
    // Check previous conversation for context
    const lastUserMessages = conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content.toLowerCase());
    
    // Check if this is a follow-up question
    const isFollowUp = lastUserMessages.length > 1 && 
                      (message.includes('what about') || 
                       message.startsWith('and') || 
                       message.includes('also') ||
                       message.length < 15);
    
    // Main response logic based on keywords and context
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! I'm your study assistant. How can I help you today? I can create study plans, find notes, or answer questions about your coursework.";
    } 
    else if (message.includes('thank')) {
        return "You're welcome! I'm here to help make your studies more effective. Let me know if you need anything else.";
    }
    else if (message.includes('bye') || message.includes('goodbye')) {
        return "Goodbye! Good luck with your studies. I'll be here when you need assistance again.";
    }
    // Study plan related responses
    else if (message.includes('study plan') || message.includes('create a study plan')) {
        return "I'd be happy to help you create a study plan! Here's what I can do:\n\n" +
               "1. Create a daily schedule based on your courses\n" +
               "2. Suggest effective study techniques for your subjects\n" +
               "3. Help prioritize topics based on exam weight\n\n" +
               "Which course would you like to focus on first?";
    }
    // Course notes related responses
    else if (message.includes('find notes') || message.includes('notes for')) {
        let course = '';
        
        // Try to extract course code from message
        const courseMatch = message.match(/\b([a-z]{2,4}\d{3})\b/i);
        if (courseMatch) {
            course = courseMatch[0].toUpperCase();
            return `I found 8 sets of notes for ${course}. The highest-rated ones are:\n\n` +
                   `• "Complete ${course} Guide" by Sarah Williams (4.9★)\n` +
                   `• "${course} Exam Prep Notes" by Mark Johnson (4.7★)\n` +
                   `• "Essential ${course} Concepts" by Professor Zhang (4.6★)\n\n` +
                   `Would you like to see details for any of these?`;
        } else {
            return "I'd be happy to find notes for your courses. Which course are you looking for? Please provide the course code (like CS301) or name.";
        }
    }
    // Exam preparation
    else if (message.includes('exam') || message.includes('study for exam') || message.includes('prepare for test')) {
        return "Here are some effective exam preparation strategies:\n\n" +
               "1. **Create a study schedule** - Plan specific topics for each day\n" +
               "2. **Use active recall** - Test yourself instead of just reviewing\n" +
               "3. **Take practice tests** - Simulate exam conditions\n" +
               "4. **Study in intervals** - 25-30 minute sessions with short breaks\n\n" +
               "Would you like a customized exam strategy for a specific course?";
    }
    // Time management
    else if (message.includes('time management') || message.includes('procrastinate') || message.includes('focus')) {
        return "Struggling with time management is common! Here are some techniques that might help:\n\n" +
               "• **Pomodoro Technique**: 25-minute focused sessions with 5-minute breaks\n" +
               "• **Time blocking**: Schedule specific times for specific tasks\n" +
               "• **Priority matrix**: Organize tasks by urgency and importance\n\n" +
               "Which of these would you like more details about?";
    }
    // Subject-specific responses
    else if (message.includes('math') || message.includes('calculus') || message.includes('algebra')) {
        return "For mathematics subjects, I recommend these study approaches:\n\n" +
               "• Practice problems are essential - theory alone isn't enough\n" +
               "• Create formula sheets for quick reference\n" +
               "• Use visualization tools for complex concepts\n" +
               "• Explain concepts in your own words to test understanding\n\n" +
               "Which math topic are you currently studying?";
    }
    else if (message.includes('program') || message.includes('coding') || message.includes('computer science')) {
        return "For programming and computer science:\n\n" +
               "• Coding is learned by doing - implement concepts in practice\n" +
               "• Use visualization tools for algorithms and data structures\n" +
               "• Build small projects to apply what you've learned\n" +
               "• Participate in code reviews to improve your skills\n\n" +
               "What programming language or concept are you working with?";
    }
    
    // Handle follow-up questions
    else if (isFollowUp) {
        // Try to determine context from previous messages
        const prevConversation = conversationHistory.slice(-4).map(msg => msg.content.toLowerCase()).join(' ');
        
        if (prevConversation.includes('study plan') || prevConversation.includes('schedule')) {
            return "To create an effective study plan, consider these key elements:\n\n" +
                   "• Allocate more time to challenging subjects\n" +
                   "• Include regular review sessions\n" +
                   "• Schedule breaks to avoid burnout\n" +
                   "• Set specific goals for each study session\n\n" +
                   "Would you like me to help you create a weekly schedule?";
        }
        else if (prevConversation.includes('note') || prevConversation.includes('course material')) {
            return "When organizing your notes, try these techniques:\n\n" +
                   "• Use the Cornell method (questions on left, notes on right)\n" +
                   "• Create concept maps to connect related ideas\n" +
                   "• Summarize each lecture in 3-5 key points\n" +
                   "• Review and condense notes within 24 hours of class\n\n" +
                   "Which method sounds most useful for your learning style?";
        }
        else {
            return "I'd be happy to explore that further. Could you provide a bit more context about what specific aspect you're interested in?";
        }
    }
    // Default response for unrecognized queries
    else {
        // Extract potential topic from the message
        const words = message.split(' ').filter(word => word.length > 3);
        const possibleTopic = words.length > 0 ? words[Math.floor(Math.random() * words.length)] : "this topic";
        
        return "I see you're asking about " + possibleTopic + ". I can help with:\n\n" +
               "• Finding relevant study materials\n" +
               "• Creating a personalized study plan\n" +
               "• Suggesting effective learning techniques\n" +
               "• Providing practice questions\n\n" +
               "What specific aspect of " + possibleTopic + " would you like help with?";
    }
}

/**
 * Initialize suggestion chips
 */
function initSuggestionChips() {
    const aiChips = document.querySelectorAll('.ai-chip');
    const aiInputField = document.getElementById('aiInputField');
    
    if (!aiInputField) return;
    
    aiChips.forEach(chip => {
        chip.addEventListener('click', function() {
            aiInputField.value = this.textContent;
            sendAiMessage();
        });
    });
}

/**
 * Update suggestion chips based on conversation context
 */
function updateSuggestionChips(message, response) {
    const chipContainer = document.querySelector('.ai-chips-container');
    const aiInputField = document.getElementById('aiInputField');
    
    if (!chipContainer || !aiInputField) return;
    
    let newChips = [];
    
    // Generate contextual suggestion chips based on the conversation
    if (response.includes('study plan') || message.includes('study plan')) {
        newChips = [
            "Create weekly study plan",
            "Study techniques for math",
            "How to prioritize subjects?"
        ];
    } 
    else if (response.includes('notes') || message.includes('notes')) {
        newChips = [
            "Best note-taking methods",
            "How to organize notes",
            "Digital vs paper notes"
        ];
    }
    else if (response.includes('exam') || message.includes('exam')) {
        newChips = [
            "Last-minute exam tips",
            "Memory techniques",
            "How to reduce test anxiety"
        ];
    }
    else {
        // Default chips
        newChips = [
            "Create a study plan",
            "Find course notes",
            "Exam preparation tips"
        ];
    }
    
    // Update the chips in the UI
    chipContainer.innerHTML = '';
    newChips.forEach(chipText => {
        const chip = document.createElement('div');
        chip.className = 'ai-chip';
        chip.textContent = chipText;
        chip.addEventListener('click', function() {
            aiInputField.value = this.textContent;
            sendAiMessage();
        });
        chipContainer.appendChild(chip);
    });
}

/**
 * AI Study Guide buttons functionality
 */
function initQuickActionButtons() {
    const generatePlanBtn = document.getElementById('generatePlanBtn');
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const findNotesBtn = document.getElementById('findNotesBtn');
    
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', function() {
            openAIAssistant("Can you generate a study plan for my upcoming exams?");
        });
    }
    
    if (askQuestionBtn) {
        askQuestionBtn.addEventListener('click', function() {
            openAIAssistant("I have a question about my coursework.");
        });
    }
    
    if (findNotesBtn) {
        findNotesBtn.addEventListener('click', function() {
            openAIAssistant("Can you help me find notes for my courses?");
        });
    }
}

/**
 * Open AI assistant with initial message
 */
function openAIAssistant(initialMessage) {
    const aiPanel = document.getElementById('aiPanel');
    const aiInputField = document.getElementById('aiInputField');
    
    if (!aiPanel || !aiInputField) return;
    
    // Open AI panel
    aiPanel.classList.add('active');
    
    // Remove notification
    const aiNotification = document.querySelector('.ai-notification');
    if (aiNotification) {
        aiNotification.style.display = 'none';
    }
    
    // Set initial message
    aiInputField.value = initialMessage;
    aiInputField.focus();
}