document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Function to add user message to chat
    function addUserMessage(message) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `
            <div class="user-avatar">JS</div>
            <div class="user-bubble-message">
                ${message}
            </div>
        `;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to add AI response to chat
    function addAIResponse(message) {
        // Simulate AI thinking with a small delay
        setTimeout(() => {
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'ai-message';
            aiMessageDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-bubble-message">
                    ${message}
                </div>
            `;
            chatMessages.appendChild(aiMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    // Handle sending message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            // Generate AI response based on user input
            const aiResponse = generateAIResponse(message);
            addAIResponse(aiResponse);
        }
    }

    // Handle send button click
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }

    // Handle Enter key press in chat input
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Handle suggestion chips
    if (suggestionChips) {
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const message = this.textContent;
                chatInput.value = message;
                sendMessage();
            });
        });
    }

    // Basic AI response generator
    function generateAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('study plan') || message.includes('schedule')) {
            return "I'd be happy to help you create a study plan! To create an effective plan, I'll need to know: <br>1. What subjects are you studying? <br>2. When are your exams or deadlines? <br>3. How many hours per day can you dedicate to studying?";
        }
        else if (message.includes('binary search tree') || message.includes('bst')) {
            return "A Binary Search Tree (BST) is a data structure where each node has at most two children, with all nodes in the left subtree having values less than the node's value, and all nodes in the right subtree having values greater. This property makes searching efficient with O(log n) time complexity on average.";
        }
        else if (message.includes('find notes') || message.includes('data structure')) {
            return "I found several notes on Data Structures in our database. The most popular ones are: <br>1. 'Complete Guide to Data Structures' by Prof. Johnson (4.9★) <br>2. 'Data Structures & Algorithms Simplified' by Emma Watson (4.8★) <br>3. 'DSA Study Guide with Practice Problems' by Mark Zhang (4.7★) <br>Would you like me to open any of these for you?";
        }
        else if (message.includes('how to study') || message.includes('study effectively')) {
            return "Here are some evidence-based study techniques that can help you: <br>1. <b>Spaced Repetition:</b> Review material at increasing intervals <br>2. <b>Active Recall:</b> Test yourself rather than just re-reading <br>3. <b>Pomodoro Technique:</b> 25 minutes focused study with 5 minute breaks <br>4. <b>Feynman Technique:</b> Explain concepts in simple terms <br>5. <b>Mind Mapping:</b> Create visual connections between ideas";
        }
        else {
            return "That's an interesting question! I'd be happy to help you with that. Could you provide a bit more context or specific details about what you're trying to learn?";
        }
    }

    // AI Feature buttons
    const generatePlanBtn = document.getElementById('generatePlanBtn');
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const explainTopicBtn = document.getElementById('explainTopicBtn');
    const findNotesBtn = document.getElementById('findNotesBtn');

    // Function to handle feature button clicks
    function handleFeatureButtonClick(message) {
        chatInput.value = message;
        sendMessage();
        // Scroll to chat section
        document.querySelector('.chat-container').scrollIntoView({ behavior: 'smooth' });
    }

    // Add event listeners for feature buttons
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', function() {
            handleFeatureButtonClick("I need help creating a study plan for my upcoming exams");
        });
    }

    if (askQuestionBtn) {
        askQuestionBtn.addEventListener('click', function() {
            handleFeatureButtonClick("I have a question about my coursework");
        });
    }

    if (explainTopicBtn) {
        explainTopicBtn.addEventListener('click', function() {
            handleFeatureButtonClick("Can you explain a complex topic to me?");
        });
    }

    if (findNotesBtn) {
        findNotesBtn.addEventListener('click', function() {
            handleFeatureButtonClick("I need to find notes on a specific subject");
        });
    }

    // Floating AI Assistant panel
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const aiClose = document.getElementById('aiClose');
    const aiInputField = document.getElementById('aiInputField');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiContent = document.getElementById('aiContent');
    const aiSuggestionChips = document.querySelectorAll('.ai-chip');

    // Toggle AI panel
    if (aiToggle && aiPanel) {
        aiToggle.addEventListener('click', function() {
            aiPanel.classList.toggle('active');
            // Remove notification indicator when opened
            document.querySelector('.ai-notification').style.display = 'none';
        });
    }

    // Close AI panel
    if (aiClose && aiPanel) {
        aiClose.addEventListener('click', function() {
            aiPanel.classList.remove('active');
        });
    }

    // Function to add user message to AI panel
    function addUserMessageToPanel(message) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `
            <div class="user-avatar">JS</div>
            <div class="user-bubble-message">
                ${message}
            </div>
        `;
        aiContent.appendChild(userMessageDiv);
        aiContent.scrollTop = aiContent.scrollHeight;
    }

    // Function to add AI response to panel
    function addAIResponseToPanel(message) {
        // Simulate AI thinking with a small delay
        setTimeout(() => {
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'ai-message';
            aiMessageDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-bubble-message">
                    ${message}
                </div>
            `;
            aiContent.appendChild(aiMessageDiv);
            aiContent.scrollTop = aiContent.scrollHeight;
        }, 800);
    }

    // Handle sending message in AI panel
    function sendMessageInPanel() {
        const message = aiInputField.value.trim();
        if (message) {
            addUserMessageToPanel(message);
            aiInputField.value = '';
            
            // Generate AI response based on user input
            const aiResponse = generateAIResponse(message);
            addAIResponseToPanel(aiResponse);
        }
    }

    // Handle send button click in AI panel
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendMessageInPanel);
    }

    // Handle Enter key press in AI panel input
    if (aiInputField) {
        aiInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessageInPanel();
            }
        });
    }

    // Handle AI panel suggestion chips
    if (aiSuggestionChips) {
        aiSuggestionChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const message = this.textContent;
                aiInputField.value = message;
                sendMessageInPanel();
            });
        });
    }

    // Handle interaction view buttons
    const interactionViewBtns = document.querySelectorAll('.interaction-view-btn');
    
    if (interactionViewBtns) {
        interactionViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const interactionItem = this.closest('.interaction-item');
                const interactionTitle = interactionItem.querySelector('.interaction-title').textContent;
                
                // Scroll to chat section
                document.querySelector('.chat-container').scrollIntoView({ behavior: 'smooth' });
                
                // Add a system message about viewing the past interaction
                const systemMessageDiv = document.createElement('div');
                systemMessageDiv.className = 'system-message';
                systemMessageDiv.textContent = `Viewing past interaction: ${interactionTitle}`;
                chatMessages.appendChild(systemMessageDiv);
                
                // Simulate loading the past interaction
                setTimeout(() => {
                    // Add mock past interaction messages based on the title
                    if (interactionTitle.includes('Algorithm Complexity')) {
                        addUserMessage("Can you explain the difference between O(n) and O(n²) time complexity?");
                        addAIResponse("Great question about algorithm complexity! Time complexity measures how an algorithm's runtime grows with input size:<br><br><b>O(n) - Linear Time:</b><br>• Runtime grows linearly with input size<br>• Example: Finding maximum value in an unsorted array<br>• If input doubles, runtime doubles<br><br><b>O(n²) - Quadratic Time:</b><br>• Runtime grows with the square of input size<br>• Example: Simple nested-loop sorts like Bubble Sort<br>• If input doubles, runtime increases 4x<br><br>O(n) algorithms are generally much more efficient than O(n²) for large inputs.");
                    } else if (interactionTitle.includes('Study Plan')) {
                        addUserMessage("I need a study plan for my Data Structures exam next week");
                        addAIResponse("Here's a 7-day study plan for your Data Structures exam:<br><br><b>Day 1:</b> Arrays, Linked Lists<br><b>Day 2:</b> Stacks, Queues<br><b>Day 3:</b> Trees, Binary Search Trees<br><b>Day 4:</b> Heaps, Priority Queues<br><b>Day 5:</b> Graphs, Graph Algorithms<br><b>Day 6:</b> Sorting Algorithms<br><b>Day 7:</b> Review & Practice Problems<br><br>Each day: 1.5 hours theory review, 1.5 hours problem solving, and 30 minutes recap. Would you like a more detailed breakdown for any specific day?");
                    } else if (interactionTitle.includes('Neural Networks')) {
                        addUserMessage("Can you explain neural networks in simple terms?");
                        addAIResponse("Neural networks are computing systems inspired by how our brains work. Here's a simplified explanation:<br><br>1. <b>Structure:</b> They consist of connected nodes (neurons) organized in layers<br><br>2. <b>Basic components:</b><br>   • Input layer: Receives data<br>   • Hidden layers: Process data<br>   • Output layer: Provides results<br><br>3. <b>How they work:</b><br>   • Each connection has a weight (importance)<br>   • Neurons receive inputs, apply weights, and activate if above a threshold<br>   • The network 'learns' by adjusting these weights<br><br>4. <b>Learning process:</b><br>   • Makes predictions<br>   • Compares to correct answers<br>   • Adjusts weights to improve (backpropagation)<br>   • Repeats until accurate<br><br>Think of it like teaching a child - showing examples, correcting mistakes, until they learn patterns.");
                    }
                }, 500);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        });
    }
});