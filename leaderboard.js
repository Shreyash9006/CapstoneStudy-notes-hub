document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.leaderboard-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Simulating content change
            filterLeaderboard();
        });
    });
    
    // Filters functionality
    const timeFilterSelect = document.querySelectorAll('.filter-select')[0];
    const levelFilterSelect = document.querySelectorAll('.filter-select')[1];
    
    timeFilterSelect.addEventListener('change', filterLeaderboard);
    levelFilterSelect.addEventListener('change', filterLeaderboard);
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', function() {
        filterLeaderboard();
    });
    
    // Initial call to populate the leaderboard
    populateLeaderboard();
    
    // Function to populate leaderboard with data (would typically fetch from an API)
    function populateLeaderboard() {
        // In a real application, this would fetch data from your backend
        console.log('Leaderboard populated');
    }
    
    // Function to filter the leaderboard based on search and filters
    function filterLeaderboard() {
        const searchTerm = searchInput.value.toLowerCase();
        const timeFilter = timeFilterSelect.value;
        const levelFilter = levelFilterSelect.value;
        const activeTab = document.querySelector('.leaderboard-tabs .tab.active').textContent;
        
        const rows = document.querySelectorAll('.leaderboard-table tbody tr');
        
        rows.forEach(row => {
            const userName = row.querySelector('.user-name').textContent.toLowerCase();
            const userSchool = row.querySelector('.user-info').textContent.toLowerCase();
            const userLevel = row.querySelector('.badge').textContent.toLowerCase();
            const subjectTags = Array.from(row.querySelectorAll('.subject-tag')).map(tag => tag.textContent.toLowerCase());
            
            // Search filter
            const matchesSearch = searchTerm === '' || 
                                  userName.includes(searchTerm) || 
                                  userSchool.includes(searchTerm) ||
                                  subjectTags.some(tag => tag.includes(searchTerm));
            
            // Level filter
            const matchesLevel = levelFilter === 'all-levels' || 
                                userLevel === levelFilter.toLowerCase();
            
            // Tab filter (simulated)
            let matchesTab = true;
            if (activeTab === 'Your School') {
                // In a real app, this would check if the user's school matches the logged-in user's school
                matchesTab = userSchool.includes('california'); // Example filter
            } else if (activeTab === 'By Subject') {
                // This would filter based on the selected subject
                // For demo purposes, we're just showing all
                matchesTab = true;
            }
            
            // Time filter would typically require date data, here we're just simulating
            let matchesTime = true;
            
            // Apply all filters
            if (matchesSearch && matchesLevel && matchesTab && matchesTime) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        updateRankings();
    }
    
    // Update the rankings after filtering
    function updateRankings() {
        const visibleRows = Array.from(document.querySelectorAll('.leaderboard-table tbody tr'))
                                .filter(row => row.style.display !== 'none');
        
        visibleRows.forEach((row, index) => {
            const rankDiv = row.querySelector('.rank');
            rankDiv.textContent = index + 1;
            
            // Clear existing rank classes
            rankDiv.classList.remove('rank-1', 'rank-2', 'rank-3');
            
            // Add appropriate rank class
            if (index === 0) rankDiv.classList.add('rank-1');
            if (index === 1) rankDiv.classList.add('rank-2');
            if (index === 2) rankDiv.classList.add('rank-3');
        });
    }
    
    // Hover effect for leaderboard rows
    const tableRows = document.querySelectorAll('.leaderboard-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.classList.add('highlight');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('highlight');
        });
        
        // Make rows clickable to view user profile
        row.addEventListener('click', function() {
            const userName = this.querySelector('.user-name').textContent;
            console.log(`Viewing profile of ${userName}`);
            // In a real app, this would navigate to the user's profile
            showToast(`Viewing profile of ${userName}`);
        });
    });
    
    // Toast notification function
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast-notification');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Add CSS for toast notifications
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: #fff;
            padding: 12px 20px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .toast-notification.show {
            opacity: 1;
        }
        
        .leaderboard-table tbody tr {
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .leaderboard-table tbody tr.highlight {
            background-color: rgba(0, 123, 255, 0.05);
        }
    `;
    document.head.appendChild(style);
    
    // Add animation effect for points when page loads
    const pointElements = document.querySelectorAll('.points');
    
    pointElements.forEach(pointElement => {
        const finalPoints = parseInt(pointElement.textContent);
        animateNumber(0, finalPoints, 1500, pointElement);
    });
    
    // Function to animate numbers counting up
    function animateNumber(start, end, duration, element) {
        let startTimestamp = null;
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
});