function generateAIResponse(message) {
    // Remove typing indicator
    removeTypingIndicator();
    
    // Show typing indicator again while waiting for real response
    showTypingIndicator();
    
    // Your actual API key for testing - replace this before production
    const API_KEY = "your-actual-openai-api-key-here";
    
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [...conversationHistory, { role: 'user', content: message }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const aiMessage = data.choices[0].message.content;
        
        // Add to conversation history
        conversationHistory.push({ role: 'assistant', content: aiMessage });
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Display the response
        displayAIMessage(aiMessage);
        
        // Update suggestion chips based on conversation
        updateSuggestionChips(message, aiMessage);
    })
    .catch(error => {
        console.error('Error fetching AI response:', error);
        removeTypingIndicator();
        displayAIMessage("Oops! I had trouble responding. Please try again.");
    });
}