// AgroGig Professional Dashboard JavaScript

// Store JWT token in localStorage
let authToken = localStorage.getItem('agrogig_token');

// Handle hash navigation
function handleHashNavigation() {
    if (window.location.hash) {
        const pageId = window.location.hash.substring(1);
        // Find the corresponding nav link
        const navLink = document.querySelector(`[data-page="${pageId}"]`);
        if (navLink) {
            // Simulate click on the nav link
            navLink.click();
        }
    }
}

// Add hash change listener
window.addEventListener('hashchange', function() {
    handleHashNavigation();
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!authToken && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html' && window.location.pathname !== '/') {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }
    
    // Handle hash navigation
    handleHashNavigation();
    
    // Page navigation functionality
    const navLinks = document.querySelectorAll('#sidebar ul li a');
    const pages = document.querySelectorAll('[id$="-page"]');
    
    // When a sidebar item is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const pageId = this.getAttribute('data-page');

            navLinks.forEach(nav => nav.classList.remove('active-page'));
            this.classList.add('active-page');

            // Hide all pages
            pages.forEach(page => {
                page.classList.add('d-none');
            });
            
            // Show the selected page
            const targetPage = document.getElementById(pageId + '-page');
            if (targetPage) {
                targetPage.classList.remove('d-none');
                targetPage.classList.add('d-block'); // Ensure it's displayed as block
                console.log('Showing page:', pageId);
            } else {
                console.error('Page not found:', pageId + '-page');
            }

            // CALL THE CORRECT PAGE LOADER
            switch (pageId) {
                case 'dashboard':
                    initializeDashboard();
                    break;
                case 'insights':
                    loadInsightsPage();
                    break;
                case 'reports':
                    loadReportsPage();
                    break;
                case 'voice-assistant':
                    loadVoiceAssistantPage();
                    break;
                case 'log-actions':
                    loadPageContent('log-actions');
                    break;
                case 'language':
                    loadLanguagePage();
                    break;
                case 'profile':
                    loadProfilePage();
                    break;
                case 'logout':
                    logoutUser();
                    break;
            }

            // APPLY LANGUAGE AFTER PAGE LOAD
            setTimeout(() => {
                if (typeof changeLanguage === 'function') {
                    changeLanguage(localStorage.getItem("preferredLanguage") || "en");
                }
            }, 50);
        });
    });
    
    // Language selector functionality
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        // Define the event handler as a named function to properly remove/add it
        function handleLanguageChange(event) {
            const lang = event.target.value;
            if (typeof changeLanguage === 'function') {
                changeLanguage(lang);
            }
        }
        
        // Remove any existing listener and add the new one
        languageSelector.removeEventListener('change', handleLanguageChange);
        languageSelector.addEventListener('change', handleLanguageChange);
        
        // Set initial value based on saved language
        const savedLang = localStorage.getItem("preferredLanguage") || "en";
        languageSelector.value = savedLang;
    }
    
    // Initialize the dashboard
    initializeDashboard();
});


// Function to load page content dynamically
function loadPageContent(pageId) {
    fetch(`./pages/${pageId}.html`)
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById(`${pageId}-page`);
            container.innerHTML = html;

            initPageAfterLoad(pageId);

            // ⭐ APPLY LANGUAGE AFTER PAGE EXISTS
            setTimeout(() => {
                const lang = localStorage.getItem("preferredLanguage") || "en";
                if (typeof changeLanguage === 'function') {
                    changeLanguage(lang);
                }
            }, 10);
        });
}

// Function to initialize page components after content is loaded
function initPageAfterLoad(pageName) {
    // Re-initialize common components
    initSidebarToggle();
    
    // Initialize page-specific components
    switch(pageName) {
        case 'log-actions':
            initLogActionsComponents();
            break;
        case 'insights':
            initInsightsComponents();
            break;
        case 'reports':
            initReportsComponents();
            break;
        case 'voice-assistant':
            initVoiceAssistantComponents();
            break;

        case 'profile':
            initProfileComponents();
            break;
        default:
            // Dashboard or other pages
            initDashboardComponents();
            break;
    }
    
    // APPLY LANGUAGE AFTER INITIALIZATION
    setTimeout(() => {
        changeLanguage(localStorage.getItem("preferredLanguage") || "en");
    }, 10);
}

// Initialize sidebar toggle functionality
function initSidebarToggle() {
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            const currentSidebar = document.getElementById('sidebar');
            currentSidebar.classList.toggle('active');
        });
    }
}

// Initialize dashboard
function initializeDashboard() {
    console.log('Dashboard initialized');
    // Fetch user data to display personalized greeting
    fetchUserData();
    // Any dashboard-specific initialization code would go here
}

// Define base API URL - use production URL if available, otherwise localhost
const BASE_API_URL = window._env_ && window._env_.BASE_API_URL 
    ? window._env_.BASE_API_URL 
    : window.location.hostname.includes('railway.app') 
        ? `https://${window.location.hostname}` 
        : window.location.hostname.includes('vercel.app')
            ? `https://${window.location.hostname}`
            : 'http://localhost:3001';

// Use relative URL if BASE_API_URL is empty (same domain deployment)
const API_BASE = BASE_API_URL ? BASE_API_URL : '';

console.log('Using API base URL:', BASE_API_URL);

// Fetch user data to display personalized greeting
function fetchUserData() {
    if (!authToken) {
        document.getElementById('user-greeting').textContent = 'Guest';
        return;
    }
    
    fetch(`${BASE_API_URL}/api/protected/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data && data.data.farmer) {
            document.getElementById('user-greeting').textContent = `Hello, ${data.data.farmer.name}!`;
        } else {
            document.getElementById('user-greeting').textContent = 'Welcome!';
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        document.getElementById('user-greeting').textContent = 'Welcome!';
    });
}

// Function to log an action
function logAction(actionType) {
    console.log('logAction called with authToken:', authToken);
    
    if (!authToken) {
        alert('You must be logged in to log actions');
        window.location.href = '/login.html';
        return;
    }
    
    console.log('Logging action:', actionType);
    
    // Get farmer ID from localStorage or fetch it
    fetch(`${API_BASE}/api/protected/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        console.log('Dashboard API response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Dashboard API response data:', data);
        if (data.success && data.data && data.data.farmer) {
            const farmerId = data.data.farmer.id;
            
            // Now log the action with the farmer ID
            return fetch(`${API_BASE}/api/actions/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    farmerId: farmerId,
                    type: actionType,
                    description: `Logged ${actionType} action`
                })
            });
        } else {
            throw new Error('Failed to get farmer data: ' + JSON.stringify(data));
        }
    })
    .then(response => {
        console.log('Log action API response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Log action API response data:', data);
        if (data.success) {
            // Check if insights or reports page is currently visible before showing alert
            const insightsPage = document.getElementById('insights-page');
            const reportsPage = document.getElementById('reports-page');
            
            const isInsightsVisible = insightsPage && insightsPage.classList.contains('d-block');
            const isReportsVisible = reportsPage && reportsPage.classList.contains('d-block');
            
            alert(`${actionType} action logged successfully! You earned ${data.score ? (data.score.totalPoints || 0) : 0} points.`);
            
            // Refresh the dashboard to show updated scores
            initializeDashboard();
            
            // Also refresh insights and reports if they are currently loaded
            if (isInsightsVisible) {
                loadInsightsPage();
            } else if (isReportsVisible) {
                loadReportsPage();
            }
        } else {
            // Handle case where message might be in different properties
            const errorMessage = data.message || data.error || 'Unknown error occurred';
            alert(`Error logging action: ${errorMessage}`);
        }
    })
    .catch(error => {
        console.error('Error logging action:', error);
        alert(`Error logging action: ${error.message || 'Network error or server unavailable. Please try again.'}`);
    });
}

// Function to start voice recognition
function startVoiceRecognition() {
    if (!authToken) {
        alert('You must be logged in to use voice recognition');
        window.location.href = '/login.html';
        return;
    }
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            alert(`You said: "${transcript}"\n\nThis would be processed to log your farming action.`);
        };
        
        recognition.onerror = function(event) {
            alert('Error occurred in recognition: ' + event.error);
        };
    } else {
        alert('Speech recognition not supported in this browser.');
    }
}

// Load Insights & Scores page
function loadInsightsPage() {
    const pageContainer = document.getElementById('insights-page');
    
    // Show loading state
    pageContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-0 text-primary-green">Insights & Scores</h2>
                <p class="text-muted">Track your farming performance</p>
            </div>
        </div>
        <div class="text-center py-5">
            <div class="spinner-border text-primary-green" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your insights...</p>
        </div>
    `;
    
    // Fetch real data - get farmer ID first, then fetch scores
    if (!authToken) {
        console.error('No auth token available');
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Insights & Scores</h2>
                    <p class="text-muted">Track your farming performance</p>
                </div>
            </div>
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Authentication Error</h5>
                <p>You must be logged in to view insights. Please login again.</p>
            </div>
        `;
        return;
    }
    
    fetch(`${BASE_API_URL}/api/protected/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Log the response data for debugging
        console.log('Dashboard API response:', data);
        
        if (data.success && data.data && data.data.farmer) {
            const farmerId = data.data.farmer.id;
            
            // Get dashboard scores for that farmer using the correct endpoint
            return fetch(`${API_BASE}/api/scores/dashboard/${farmerId})
                .then(res => {
                    console.log('Scores API response status:', res.status);
                    return res.json();
                })
                .then(scoreData => {
                    console.log('Scores API response data:', scoreData);
                    if (scoreData.success) {
                        return {
                            farmer: data.data.farmer,
                            scores: scoreData.scores
                        };
                    } else {
                        throw new Error('Failed to fetch dashboard scores: ' + (scoreData.message || 'Unknown error'));
                    }
                });
        } else {
            // Provide more detailed error information
            let errorMessage = 'Failed to fetch user data';
            if (!data) {
                errorMessage += ': No data received from server';
            } else if (!data.success) {
                errorMessage += ': API returned success=false';
            } else if (!data.data) {
                errorMessage += ': No data field in response';
            } else if (!data.data.farmer) {
                errorMessage += ': No farmer data in response';
            }
            throw new Error(errorMessage);
        }
    })
    .then(({ farmer, scores }) => {
        // Use real scores from API - backend returns scores directly, not in categoryScores
        const soilHealth = scores.soil || 0;
        const irrigation = scores.irrigation || 0;
        const sustainability = scores.sustainability || 0;
        const weedControl = scores.weed || 0;
        
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Insights & Scores</h2>
                    <p class="text-muted">Track your farming performance</p>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-3 mb-4">
                    <div class="card border-left-success shadow h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1" data-soil-health-label>
                                        Soil Health
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="soilHealthScore">${soilHealth}/100</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-heart fa-2x text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card border-left-primary shadow h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1" data-irrigation-label>
                                        Irrigation
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="irrigationScore">${irrigation}/100</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-tint fa-2x text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card border-left-warning shadow h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1" data-sustainability-label>
                                        Sustainability
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="sustainabilityScore">${sustainability}/100</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-recycle fa-2x text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card border-left-info shadow h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1" data-weed-control-label>
                                        Weed Control
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="weedControlScore">${weedControl}/100</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-leaf fa-2x text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-sun-yellow text-dark">
                            <h5 class="mb-0"><i class="fas fa-trophy me-2"></i>Recent Achievements</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <i class="fas fa-medal text-warning me-2"></i>
                                    Smart Irrigator
                                    <span class="float-end text-muted">Mar 10</span>
                                </li>
                                <li class="list-group-item">
                                    <i class="fas fa-heart text-success me-2"></i>
                                    Soil Protector
                                    <span class="float-end text-muted">Mar 15</span>
                                </li>
                                <li class="list-group-item">
                                    <i class="fas fa-leaf text-info me-2"></i>
                                    Weed Warrior
                                    <span class="float-end text-muted">Mar 20</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // No charts to initialize
    })
    .catch(error => {
        console.error('Error loading insights page:', error);
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Insights & Scores</h2>
                    <p class="text-muted">Track your farming performance</p>
                </div>
            </div>
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Error Loading Data</h5>
                <p>Unable to load your insights at this time. Please try again later.</p>
                <p class="text-muted small">Error: ${error.message}</p>
            </div>
        `;
    });
}

// Load Reports page
function loadReportsPage() {
    const pageContainer = document.getElementById('reports-page');
    
    // Show loading state
    pageContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-0 text-primary-green">Monthly Reports</h2>
                <p class="text-muted">Download your farming performance reports</p>
            </div>
            <button class="btn btn-primary-green" id="downloadReport" data-download-pdf-btn disabled>
                <i class="fas fa-download me-2"></i>Download PDF
            </button>
        </div>
        <div class="text-center py-5">
            <div class="spinner-border text-primary-green" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your report...</p>
        </div>
    `;
    
    // Fetch real data from the new reports endpoint and dashboard for farmer info
    if (!authToken) {
        console.error('No auth token available');
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Monthly Reports</h2>
                    <p class="text-muted">Download your farming performance reports</p>
                </div>
                <button class="btn btn-primary-green" id="downloadReport" data-download-pdf-btn disabled>
                    <i class="fas fa-download me-2"></i>Download PDF
                </button>
            </div>
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Authentication Error</h5>
                <p>You must be logged in to view reports. Please login again.</p>
            </div>
        `;
        return;
    }
    
    fetch(`${API_BASE}/api/protected/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        console.log('Dashboard API response status:', response.status);
        return response.json();
    })
    .then(dashboardData => {
        // Log the response data for debugging
        console.log('Dashboard API response:', dashboardData);
        
        if (dashboardData.success && dashboardData.data && dashboardData.data.farmer) {
            const farmerId = dashboardData.data.farmer.id;
            // Now fetch the monthly report for this farmer using the correct endpoint
            return fetch(`${API_BASE}/api/monthly-reports/monthly/${farmerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(monthlyReportResponse => {
                console.log('Monthly report API response status:', monthlyReportResponse.status);
                return monthlyReportResponse.json();
            })
            .then(monthlyReportData => {
                console.log('Monthly report API response data:', monthlyReportData);
                if (monthlyReportData.success && monthlyReportData.report) {
                    // Now fetch badges for this farmer
                    return fetch(`${API_BASE}/api/scores/badges/${farmerId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    })
                    .then(badgesResponse => badgesResponse.json())
                    .then(badgesData => {
                        console.log('Badges API response data:', badgesData);
                        return {
                            farmer: dashboardData.data.farmer,
                            actions: dashboardData.data.actions || [],
                            badges: badgesData.success && badgesData.badges ? badgesData.badges : [],
                            monthlyReport: monthlyReportData.report
                        };
                    });
                } else {
                    // Provide more detailed error information for monthly report
                    let errorMessage = 'Failed to fetch monthly report data';
                    if (!monthlyReportData) {
                        errorMessage += ': No data received from server';
                    } else if (!monthlyReportData.success) {
                        errorMessage += ': API returned success=false';
                    } else if (!monthlyReportData.report) {
                        errorMessage += ': No report field in response';
                    }
                    throw new Error(errorMessage);
                }
            });
        } else {
            // Provide more detailed error information for dashboard data
            let errorMessage = 'Failed to fetch dashboard data';
            if (!dashboardData) {
                errorMessage += ': No data received from server';
            } else if (!dashboardData.success) {
                errorMessage += ': API returned success=false';
            } else if (!dashboardData.data) {
                errorMessage += ': No data field in response';
            } else if (!dashboardData.data.farmer) {
                errorMessage += ': No farmer data in response';
            }
            throw new Error(errorMessage);
        }
    })
    .then(({ farmer, actions, badges, monthlyReport }) => {
        // Calculate report data from real API data
        const totalActions = actions.length;
        const totalScore = monthlyReport.total_score || 0;
        const badgesEarned = badges.length;
        
        // Use real scores from monthly report API with proper mapping
        const soilHealth = Math.min(100, (monthlyReport.fertilizing || 0) * 10);
        const irrigation = Math.min(100, (monthlyReport.watering || 0) * 5);
        const sustainability = Math.min(100, (monthlyReport.monitoring || 0) * 4);
        const weedControl = Math.min(100, (monthlyReport.weeding || 0) * 8);
        
        // Use activity counts for chart data with proper mapping
        const weeklyReport = [
            monthlyReport.watering || 0,
            monthlyReport.weeding || 0,
            monthlyReport.fertilizing || 0,
            monthlyReport.irrigation || 0,
            monthlyReport.monitoring || 0,
            0, // Placeholder for additional activities
            0  // Placeholder for additional activities
        ];
        
        // Get current month name
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentDate = new Date();
        const currentMonth = monthNames[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Monthly Reports</h2>
                    <p class="text-muted">Download your farming performance reports</p>
                </div>
                <button class="btn btn-primary-green" id="downloadReport" data-download-pdf-btn 
                    data-farmer-name="${farmer.name}" 
                    data-report-period="${currentMonth} ${currentYear}" 
                    data-total-actions="${totalActions}" 
                    data-total-score="${totalScore}" 
                    data-badges-earned="${badgesEarned}" 
                    data-soil-health="${soilHealth}" 
                    data-irrigation="${irrigation}" 
                    data-sustainability="${sustainability}" 
                    data-weed-control="${weedControl}" 
                    data-watering-report="${monthlyReport.watering || 0}" 
                    data-weeding-report="${monthlyReport.weeding || 0}" 
                    data-fertilizing-report="${monthlyReport.fertilizing || 0}" 
                    data-irrigation-report="${monthlyReport.irrigation || 0}" 
                    data-monitoring-report="${monthlyReport.monitoring || 0}">
                    <i class="fas fa-download me-2"></i>Download PDF
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary-green text-white">
                            <h5 class="mb-0" data-report-card-title><i class="fas fa-chart-bar me-2"></i>${currentMonth} ${currentYear} Report</h5>
                        </div>
                        <div class="card-body">
                            <div class="row mb-4">
                                <div class="col-md-3 text-center">
                                    <h3 class="text-primary-green" id="reportSoilHealth">${soilHealth}</h3>
                                    <p class="mb-0">Soil Health</p>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h3 class="text-primary" id="reportIrrigation">${irrigation}</h3>
                                    <p class="mb-0">Irrigation</p>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h3 class="text-warning" id="reportSustainability">${sustainability}</h3>
                                    <p class="mb-0">Sustainability</p>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h3 class="text-info" id="reportWeedControl">${weedControl}</h3>
                                    <p class="mb-0">Weed Control</p>
                                </div>
                            </div>
                            
                            <canvas id="monthlyChart" height="100"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-sun-yellow text-dark">
                            <h5 class="mb-0" data-summary-title><i class="fas fa-list me-2"></i>Summary</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Total Actions</span>
                                    <strong>${totalActions}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Total Score</span>
                                    <strong>+${totalScore}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Badges Earned</span>
                                    <strong>${badgesEarned}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Best Month</span>
                                    <strong>${currentMonth}</strong>
                                </li>
                            </ul>
                            
                            <div class="mt-3">
                                <h6><i class="fas fa-lightbulb me-2"></i>Recommendations</h6>
                                <ul class="small">
                                    <li>Increase weeding frequency</li>
                                    <li>Apply nitrogen fertilizer next week</li>
                                    <li>Mulch to retain soil moisture</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            const ctx = document.getElementById('monthlyChart');
            if (ctx) {
                // Use weekly report data for the chart
                const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const data = weeklyReport;
                
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Weekly Activities',
                            data: data,
                            backgroundColor: [
                                '#2E8B57',
                                '#8FBC8F',
                                '#C2A878',
                                '#F1C40F',
                                '#3498db',
                                '#9b59b6',
                                '#e74c3c'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
            
            // Add event listener to the download button
            const downloadBtn = document.getElementById('downloadReport');
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.addEventListener('click', function() {
                    const farmerName = downloadBtn.getAttribute('data-farmer-name');
                    const reportPeriod = downloadBtn.getAttribute('data-report-period');
                    const totalActions = parseInt(downloadBtn.getAttribute('data-total-actions'));
                    const totalScore = parseInt(downloadBtn.getAttribute('data-total-score'));
                    const badgesEarned = parseInt(downloadBtn.getAttribute('data-badges-earned'));
                    const soilHealth = parseInt(downloadBtn.getAttribute('data-soil-health'));
                    const irrigation = parseInt(downloadBtn.getAttribute('data-irrigation'));
                    const sustainability = parseInt(downloadBtn.getAttribute('data-sustainability'));
                    const weedControl = parseInt(downloadBtn.getAttribute('data-weed-control'));
                    const wateringReport = parseInt(downloadBtn.getAttribute('data-watering-report'));
                    const weedingReport = parseInt(downloadBtn.getAttribute('data-weeding-report'));
                    const fertilizingReport = parseInt(downloadBtn.getAttribute('data-fertilizing-report'));
                    const irrigationReport = parseInt(downloadBtn.getAttribute('data-irrigation-report'));
                    const monitoringReport = parseInt(downloadBtn.getAttribute('data-monitoring-report'));
                    
                    downloadReport(farmerName, reportPeriod, totalActions, totalScore, badgesEarned, soilHealth, irrigation, sustainability, weedControl, wateringReport, weedingReport, fertilizingReport, irrigationReport, monitoringReport);
                });
            }
        }, 100);
    })
    .catch(error => {
        console.error('Error loading reports page:', error);
        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 text-primary-green">Monthly Reports</h2>
                    <p class="text-muted">Download your farming performance reports</p>
                </div>
                <button class="btn btn-primary-green" id="downloadReport" data-download-pdf-btn disabled>
                    <i class="fas fa-download me-2"></i>Download PDF
                </button>
            </div>
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Error Loading Data</h5>
                <p>Unable to load your report at this time. Please try again later.</p>
                <p class="text-muted small">Error: ${error.message}</p>
            </div>
        `;
    });
}

// Function to download report
function downloadReport(farmerName, reportPeriod, totalActions, totalScore, badgesEarned, soilHealth = 0, irrigation = 0, sustainability = 0, weedControl = 0, wateringReport = 0, weedingReport = 0, fertilizingReport = 0, irrigationReport = 0, monitoringReport = 0) {
    try {
        console.log('Download report function called with params:', { farmerName, reportPeriod, totalActions, totalScore, badgesEarned, soilHealth, irrigation, sustainability, weedControl, wateringReport, weedingReport, fertilizingReport, irrigationReport, monitoringReport });
        
        // Check if jsPDF is available
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not available. window.jspdf:', window.jspdf);
            alert('PDF library not loaded. Please try again.');
            return;
        }
        console.log('jsPDF library is available');
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(22);
        doc.setTextColor(46, 139, 87); // Primary green color
        doc.text('AgroGig Farming Report', 105, 20, null, null, 'center');
        
        // Add subtitle
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(reportPeriod, 105, 30, null, null, 'center');
        
        // Add farmer name
        doc.setFontSize(12);
        doc.text(`Farmer: ${farmerName}`, 20, 45);
        
        // Add report date
        const reportDate = new Date().toLocaleDateString();
        doc.text(`Report Generated: ${reportDate}`, 20, 55);
        
        // Add summary section
        doc.setFontSize(16);
        doc.setTextColor(46, 139, 87);
        doc.text('Summary', 20, 70);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Actions: ${totalActions}`, 20, 85);
        doc.text(`Total Score: +${totalScore}`, 20, 95);
        doc.text(`Badges Earned: ${badgesEarned}`, 20, 105);
        
        // Add performance metrics
        doc.setFontSize(16);
        doc.setTextColor(46, 139, 87);
        doc.text('Performance Metrics', 20, 125);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Soil Health: ${soilHealth}/100`, 20, 140);
        doc.text(`Irrigation: ${irrigation}/100`, 20, 150);
        doc.text(`Sustainability: ${sustainability}/100`, 20, 160);
        doc.text(`Weed Control: ${weedControl}/100`, 20, 170);
        
        // Add activity details
        doc.setFontSize(16);
        doc.setTextColor(46, 139, 87);
        doc.text('Activity Summary', 20, 190);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Watering Activities: ${wateringReport}`, 20, 205);
        doc.text(`Weeding Activities: ${weedingReport}`, 20, 215);
        doc.text(`Fertilizing Activities: ${fertilizingReport}`, 20, 225);
        doc.text(`Irrigation Activities: ${irrigationReport}`, 20, 235);
        doc.text(`Monitoring Activities: ${monitoringReport}`, 20, 245);
        
        // Add recommendations
        doc.setFontSize(16);
        doc.setTextColor(46, 139, 87);
        doc.text('Recommendations', 20, 265);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('1. Increase weeding frequency', 20, 280);
        doc.text('2. Apply nitrogen fertilizer next week', 20, 290);
        doc.text('3. Mulch to retain soil moisture', 20, 300);
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by AgroGig - Gigifying Everyday Farming Actions', 105, 320, null, null, 'center');
        doc.text('Page 1 of 1', 105, 325, null, null, 'center');
        
        // Save the PDF
        console.log('About to save PDF with filename:', `AgroGig_Report_${reportPeriod.replace(' ', '_')}.pdf`);
        doc.save(`AgroGig_Report_${reportPeriod.replace(' ', '_')}.pdf`);
        console.log('PDF save function called');
    } catch (error) {
        console.error('Error generating PDF report:', error);
        alert('Error generating PDF report. Please try again.');
    }
}

// Load Voice Assistant page
function loadVoiceAssistantPage() {
    const pageContainer = document.getElementById('voice-assistant-page');
    pageContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-0 text-primary-green">Voice Assistant</h2>
                <p class="text-muted">Ask questions and get AI-powered farming advice</p>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary-green text-white">
                        <h5 class="mb-0" data-ask-question-title><i class="fas fa-microphone me-2"></i>Ask Your Question</h5>
                    </div>
                    <div class="card-body">
                        <div class="text-center p-5">
                            <button class="btn btn-primary-green btn-lg rounded-circle p-4 mb-4" id="startVoiceQuestion">
                                <i class="fas fa-microphone-alt fa-3x"></i>
                            </button>
                            <h4>Tap to Speak</h4>
                            <p class="text-muted">Ask me anything about farming, weather, or your crops</p>
                        </div>
                        
                        <div class="mt-4">
                            <h5 class="mb-3" data-suggested-questions-title>Try Asking:</h5>
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <button class="btn btn-outline-primary-green w-100 text-start" data-question="Should I water today?">
                                        <i class="fas fa-question-circle me-2"></i>"Should I water today?"
                                    </button>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <button class="btn btn-outline-primary-green w-100 text-start" data-question="Is weed risk high?">
                                        <i class="fas fa-question-circle me-2"></i>"Is weed risk high?"
                                    </button>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <button class="btn btn-outline-primary-green w-100 text-start" data-question="What is the weather tomorrow?">
                                        <i class="fas fa-question-circle me-2"></i>"What is the weather tomorrow?"
                                    </button>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <button class="btn btn-outline-primary-green w-100 text-start" data-question="When to fertilize tomatoes?">
                                        <i class="fas fa-question-circle me-2"></i>"When to fertilize tomatoes?"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-sun-yellow text-dark">
                        <h5 class="mb-0"><i class="fas fa-history me-2"></i>Recent Questions</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <div class="fw-bold">Should I water today?</div>
                                <div class="text-muted small">Based on weather conditions, it's a good day for watering.</div>
                                <div class="text-muted small">2 hours ago</div>
                            </li>
                            <li class="list-group-item">
                                <div class="fw-bold">Is weed risk high?</div>
                                <div class="text-muted small">With 65% humidity, weed risk is moderate. Consider weeding.</div>
                                <div class="text-muted small">Yesterday</div>
                            </li>
                            <li class="list-group-item">
                                <div class="fw-bold">When to fertilize tomatoes?</div>
                                <div class="text-muted small">Best to fertilize during flowering stage.</div>
                                <div class="text-muted small">Mar 15</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize voice assistant components after a short delay
    setTimeout(() => {
        initVoiceAssistantComponents();
    }, 50);
}

// Function to start voice question
function startVoiceQuestion() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            simulateAIResponse(transcript);
        };
        
        recognition.onerror = function(event) {
            alert('Error occurred in recognition: ' + event.error);
        };
        
        recognition.onend = function() {
            console.log('Speech recognition ended');
        };
    } else {
        alert('Speech recognition not supported in this browser. Try using Chrome or Edge.');
    }
}

// Function to ask a predefined question
function askQuestion(question) {
    simulateAIResponse(question);
}

// Function to simulate AI response
function simulateAIResponse(question) {
    let response = '';
    
    if (question.toLowerCase().includes('water')) {
        response = 'Based on current weather conditions, it\'s a good day for watering your crops. The soil moisture level is at 45%, which is optimal for irrigation.';
    } else if (question.toLowerCase().includes('weed')) {
        response = 'With 65% humidity, weed risk is moderate. Consider weeding your fields in the next 2 days to prevent overgrowth.';
    } else if (question.toLowerCase().includes('weather')) {
        response = 'Tomorrow\'s forecast shows partly cloudy skies with a 20% chance of rain. Temperature will range between 26-30°C.';
    } else if (question.toLowerCase().includes('fertilize')) {
        response = 'For tomatoes, the best time to fertilize is during the flowering stage. Based on your last fertilization date, you should apply nitrogen-rich fertilizer in 3 days.';
    } else {
        response = 'I understand your question about "' + question + '". Based on your farming data, I recommend monitoring your crops closely and following best practices for optimal yield.';
    }
    
    alert('You asked: "' + question + '"\n\nAI Response: ' + response);
}

// Load Language Settings page
function loadLanguagePage() {
    const pageContainer = document.getElementById('language-page');
    pageContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-0 text-primary-green">Language Settings</h2>
                <p class="text-muted">Choose your preferred language</p>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary-green text-white">
                        <h5 class="mb-0" data-select-language-title><i class="fas fa-globe me-2"></i>Select Language</h5>
                    </div>
                    <div class="card-body">
                        <div class="list-group">
                            <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center active">
                                <div>
                                    <i class="fas fa-flag me-2"></i>
                                    <strong>English</strong>
                                    <div class="small text-muted">Default language</div>
                                </div>
                                <i class="fas fa-check-circle text-success"></i>
                            </button>
                            <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="fas fa-flag me-2"></i>
                                    <strong>हिन्दी (Hindi)</strong>
                                    <div class="small text-muted">भारतीय भाषा</div>
                                </div>
                            </button>
                            <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="fas fa-flag me-2"></i>
                                    <strong>ಕನ್ನಡ (Kannada)</strong>
                                    <div class="small text-muted">ಕರ್ನಾಟಕದ ಭಾಷೆ</div>
                                </div>
                            </button>
                        </div>
                        
                        <div class="mt-4">
                            <h5 class="mb-3" data-change-language-title><i class="fas fa-sync me-2"></i>Change Language</h5>
                            <p>Select a language above to change the interface language instantly.</p>
                            <button class="btn btn-primary-green">Apply Changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-sun-yellow text-dark">
                        <h5 class="mb-0" data-info-title><i class="fas fa-info-circle me-2"></i>Information</h5>
                    </div>
                    <div class="card-body">
                        <h6>How Language Settings Work</h6>
                        <ul>
                            <li>All interface text will appear in your selected language</li>
                            <li>Voice input works in any language</li>
                            <li>Reports and data remain in English</li>
                            <li>Changes take effect immediately</li>
                        </ul>
                        
                        <div class="alert alert-info">
                            <i class="fas fa-lightbulb me-2"></i>
                            <strong>Note:</strong> You can change language anytime from the sidebar.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize language components after page is loaded
    setTimeout(() => {
        initLanguageComponents();
        
        // Apply current language
        const currentLang = localStorage.getItem('agrogig_language') || 'en';
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.value = currentLang;
        }
    }, 50);
}

// Load Profile page
function loadProfilePage() {
    const pageContainer = document.getElementById('profile-page');
    pageContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-0 text-primary-green">Profile</h2>
                <p class="text-muted">Manage your account information</p>
            </div>
            <button class="btn btn-primary-green" data-edit-profile-btn>
                <i class="fas fa-edit me-2"></i>Edit Profile
            </button>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary-green text-white">
                        <h5 class="mb-0" data-profile-picture-title><i class="fas fa-user me-2"></i>Profile Picture</h5>
                    </div>
                    <div class="card-body text-center">
                        <img src="https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2E8B57&color=fff&size=128" 
                             alt="Profile" class="rounded-circle mb-3" width="128" height="128" id="profileImage" data-original-src="https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2E8B57&color=fff&size=128">
                        <button class="btn btn-outline-primary-green" id="changePhotoBtn">
                            <i class="fas fa-camera me-2"></i>Change Photo
                        </button>
                        <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary-green text-white">
                        <h5 class="mb-0" data-personal-info-title><i class="fas fa-address-card me-2"></i>Personal Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-full-name-label>Full Name</label>
                                <div class="d-flex align-items-center">
                                    <p id="fullName" class="mb-0">Loading...</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editNameBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="nameEditForm" class="mt-2 d-none">
                                    <input type="text" class="form-control mb-2" id="nameInput" placeholder="Enter your name">
                                    <button class="btn btn-sm btn-primary-green" id="saveNameBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelNameBtn">Cancel</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-email-label>Email Address</label>
                                <div class="d-flex align-items-center">
                                    <p id="emailAddress" class="mb-0">Not specified</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editEmailBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="emailEditForm" class="mt-2 d-none">
                                    <input type="email" class="form-control mb-2" id="emailInput" placeholder="Enter your email">
                                    <button class="btn btn-sm btn-primary-green" id="saveEmailBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelEmailBtn">Cancel</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-phone-label>Phone Number</label>
                                <div class="d-flex align-items-center">
                                    <p id="phoneNumber" class="mb-0">Not specified</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editPhoneBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="phoneEditForm" class="mt-2 d-none">
                                    <input type="tel" class="form-control mb-2" id="phoneInput" placeholder="Enter your phone number">
                                    <button class="btn btn-sm btn-primary-green" id="savePhoneBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelPhoneBtn">Cancel</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-location-label>Location</label>
                                <div class="d-flex align-items-center">
                                    <p id="userLocation" class="mb-0">Not specified</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editLocationBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="locationEditForm" class="mt-2 d-none">
                                    <input type="text" class="form-control mb-2" id="locationInput" placeholder="Enter your location">
                                    <button class="btn btn-sm btn-primary-green" id="saveLocationBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelLocationBtn">Cancel</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-crop-label>Primary Crop</label>
                                <div class="d-flex align-items-center">
                                    <p id="primaryCrop" class="mb-0">Not specified</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editCropBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="cropEditForm" class="mt-2 d-none">
                                    <input type="text" class="form-control mb-2" id="cropInput" placeholder="Enter your primary crop">
                                    <button class="btn btn-sm btn-primary-green" id="saveCropBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelCropBtn">Cancel</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-farm-size-label>Farm Size</label>
                                <div class="d-flex align-items-center">
                                    <p id="farmSize" class="mb-0">Not specified</p>
                                    <button class="btn btn-sm btn-outline-primary-green ms-2" id="editFarmSizeBtn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                                <div id="farmSizeEditForm" class="mt-2 d-none">
                                    <input type="text" class="form-control mb-2" id="farmSizeInput" placeholder="Enter your farm size">
                                    <button class="btn btn-sm btn-primary-green" id="saveFarmSizeBtn">Save</button>
                                    <button class="btn btn-sm btn-outline-secondary ms-2" id="cancelFarmSizeBtn">Cancel</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-member-since-label>Member Since</label>
                                <p id="memberSince">-</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold" data-last-login-label>Last Login</label>
                                <p id="lastLogin">-</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="card shadow-sm">
                    <div class="card-header bg-sun-yellow text-dark">
                        <h5 class="mb-0" data-account-settings-title><i class="fas fa-cog me-2"></i>Account Settings</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-primary-green w-100" data-change-password-btn>
                                    <i class="fas fa-lock me-2"></i>Change Password
                                </button>
                            </div>
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-primary-green w-100" data-notification-btn>
                                    <i class="fas fa-bell me-2"></i>Notification Preferences
                                </button>
                            </div>
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-primary-green w-100" data-delete-account-btn>
                                    <i class="fas fa-trash me-2"></i>Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize profile components after a short delay
    setTimeout(() => {
        initProfileComponents();
        
        // Add functionality to the Edit Profile button
        const editProfileBtn = document.querySelector('[data-edit-profile-btn]');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                // Show all edit forms
                const editButtons = [
                    'editNameBtn',
                    'editEmailBtn',
                    'editPhoneBtn',
                    'editLocationBtn',
                    'editCropBtn',
                    'editFarmSizeBtn'
                ];
                
                editButtons.forEach(btnId => {
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.click();
                    }
                });
            });
        }
    }, 50);
}

// Handle Logout
function logoutUser() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Remove token from localStorage
        localStorage.removeItem('agrogig_token');
        
        // Clear authToken variable
        authToken = null;
        
        // Redirect to login page
        window.location.href = '/login.html';
    }
}

// Update login form submission
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Make API call to login
        fetch(`${BASE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('agrogig_token', data.token);
                authToken = data.token;
                
                // Redirect to dashboard
                window.location.href = '/dashboard-professional.html';
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });
}

// Update register form submission
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const language = document.getElementById('language').value;
        
        // Make API call to register
        fetch(`${BASE_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone, location, language })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                alert('Registration successful! Please login with your credentials.');
                
                // Redirect to login page
                window.location.href = '/login.html';
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        });
    });
}

/* -----------------------------------------
   UNIFIED LANGUAGE SYSTEM (ONLY THIS WORKS)
------------------------------------------ */

// Store all translations
const translations = {
    en: {
        dashboard: "Dashboard",
        logActions: "Log Actions",
        insights: "Insights & Scores",
        reports: "My Reports",
        chatbot: "Chatbot",
        language: "Language Settings",
        profile: "Profile",
        logout: "Logout",

        languageSettingsTitle: "Language Settings",
        selectLanguage: "Select Language",
        changeLanguage: "Change Language",
        applyChanges: "Apply Changes",
        
        // Language names
        english: "English",
        hindi: "हिन्दी",
        kannada: "ಕನ್ನಡ",
    },

    hi: {
        dashboard: "डैशबोर्ड",
        logActions: "कार्य दर्ज करें",
        insights: "अंतर्दृष्टि और स्कोर",
        reports: "मेरी रिपोर्टें",
        chatbot: "चैटबॉट",
        language: "भाषा सेटिंग्स",
        profile: "प्रोफ़ाइल",
        logout: "लॉगआउट",

        languageSettingsTitle: "भाषा सेटिंग्स",
        selectLanguage: "भाषा चुनें",
        changeLanguage: "भाषा बदलें",
        applyChanges: "परिवर्तन लागू करें",
        
        // Language names
        english: "English",
        hindi: "हिन्दी",
        kannada: "ಕನ್ನಡ",
    },

    kn: {
        dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
        logActions: "ಕ್ರಿಯೆಗಳು",
        insights: "ಅಂತರ್ದೃಷ್ಟಿ & ಸ್ಕೋರ್‌ಗಳು",
        reports: "ನನ್ನ ವರದಿಗಳು",
        chatbot: "ಚಾಟ್‌ಬಾಟ್",
        language: "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್ಗಳು",
        profile: "ಪ್ರೊಫೈಲ್",
        logout: "ಲಾಗೌಟ್",

        languageSettingsTitle: "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್ಗಳು",
        selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
        changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
        applyChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಅನ್ವಯಿಸಿ",
        
        // Language names
        english: "English",
        hindi: "हिन्दी",
        kannada: "ಕನ್ನಡ",
    }
};


/* -----------------------------------------
   CHANGE LANGUAGE (MAIN FUNCTION)
------------------------------------------ */
function changeLanguage(lang) {
    localStorage.setItem("preferredLanguage", lang);
    updatePageText(lang);
}


/* -----------------------------------------
   UPDATE ALL TEXT IN THE PAGE
------------------------------------------ */
function updatePageText(lang) {
    const t = translations[lang];

    // Update Sidebar Text using a loop to avoid line break issues
    const sidebarTextMap = {
        'dashboard': t.dashboard,
        'log-actions': t.logActions,
        'insights': t.insights,
        'reports': t.reports,
        'chatbot': t.chatbot,
        'language': t.language,
        'profile': t.profile,
        'logout': t.logout
    };

    Object.entries(sidebarTextMap).forEach(([pageId, text]) => {
        const element = document.querySelector(`[data-page="${pageId}"] .nav-link-text`);
        if (element) {
            element.textContent = text;
        }
    });

    // Update Language Page using data-lang keys
    const languagePageTextMap = {
        'languageSettingsTitle': t.languageSettingsTitle,
        'selectLanguage': t.selectLanguage,
        'changeLanguage': t.changeLanguage,
        'applyChanges': t.applyChanges
    };

    Object.entries(languagePageTextMap).forEach(([dataLang, text]) => {
        const element = document.querySelector(`[data-lang="${dataLang}"]`);
        if (element) {
            element.textContent = text;
        }
    });

    // Update language selector dropdown options
    const languageSelector = document.getElementById("languageSelector");
    if (languageSelector) {
        // Update the text of each option
        const options = languageSelector.querySelectorAll('option');
        if (options.length >= 3) {
            options[0].textContent = t.english || "English";  // Fallback to English if not defined
            options[1].textContent = t.hindi || "हिन्दी";     // Fallback to Hindi if not defined
            options[2].textContent = t.kannada || "ಕನ್ನಡ";    // Fallback to Kannada if not defined
        }
        
        // Set the selected value
        languageSelector.value = lang;
    }
    
    // Also update any other language selectors that might be on the page
    document.querySelectorAll("select[id='languageSelector']").forEach(selector => {
        const options = selector.querySelectorAll('option');
        if (options.length >= 3) {
            options[0].textContent = t.english || "English";
            options[1].textContent = t.hindi || "हिन्दी";
            options[2].textContent = t.kannada || "ಕನ್ನಡ";
        }
        selector.value = lang;
    });
}


/* -----------------------------------------
   APPLY LANGUAGE ON EVERY PAGE LOAD
------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("preferredLanguage") || "en";
    updatePageText(saved);
    
    // Ensure language selector is properly initialized
    setTimeout(() => {
        const languageSelector = document.getElementById("languageSelector");
        if (languageSelector) {
            languageSelector.value = saved;
        }
    }, 100);
});

// Initialize dashboard components
function initDashboardComponents() {
    // Any dashboard-specific initialization
    console.log('Dashboard components initialized');
}

// Initialize log actions components
function initLogActionsComponents() {
    console.log('initLogActionsComponents called');
    
    // Add event listeners for action buttons
    const actionButtons = document.querySelectorAll('[data-action-type]');
    console.log('Found action buttons:', actionButtons.length);
    
    actionButtons.forEach(button => {
        // Remove any existing event listener to prevent duplicates
        const actionType = button.getAttribute('data-action-type');
        
        // If there's already a handler stored, remove it
        if (button._logActionHandler) {
            button.removeEventListener('click', button._logActionHandler);
        }
        
        // Create new handler and store it
        const handler = function() {
            logAction(actionType);
        };
        button._logActionHandler = handler;
        button.addEventListener('click', handler);
        
        console.log('Added event listener for action:', actionType);
    });
    
    // Add event listener for voice input button
    const voiceInputBtn = document.getElementById('startVoiceInput');
    if (voiceInputBtn) {
        console.log('Found voice input button');
        
        // Remove any existing event listener to prevent duplicates
        if (voiceInputBtn._voiceRecognitionHandler) {
            voiceInputBtn.removeEventListener('click', voiceInputBtn._voiceRecognitionHandler);
        }
        
        // Store handler and add event listener
        voiceInputBtn._voiceRecognitionHandler = startVoiceRecognition;
        voiceInputBtn.addEventListener('click', startVoiceRecognition);
    } else {
        console.log('Voice input button not found');
    }
}

// Initialize insights components
function initInsightsComponents() {
    // Any insights-specific initialization
    console.log('Insights components initialized');
}

// Initialize reports components
function initReportsComponents() {
    // Any reports-specific initialization
    console.log('Reports components initialized');
}

// Initialize voice assistant components
function initVoiceAssistantComponents() {
    // Add event listener for voice question button
    const voiceQuestionBtn = document.getElementById('startVoiceQuestion');
    if (voiceQuestionBtn) {
        voiceQuestionBtn.addEventListener('click', startVoiceQuestion);
    }
    
    // Add event listeners for suggested questions
    document.querySelectorAll('[data-question]').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            askQuestion(question);
        });
    });
}


// Initialize profile components
function initProfileComponents() {
    // Add event listener for change photo button
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    if (changePhotoBtn && photoUpload) {
        changePhotoBtn.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profileImage = document.getElementById('profileImage');
                    profileImage.src = e.target.result;
                    // In a real app, you would upload this to the server
                    alert('Profile photo updated! (In a real app, this would be saved to the server)');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Add event listeners for name editing
    const editNameBtn = document.getElementById('editNameBtn');
    const nameEditForm = document.getElementById('nameEditForm');
    const fullNameElement = document.getElementById('fullName');
    const nameInput = document.getElementById('nameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    
    if (editNameBtn && nameEditForm && fullNameElement && nameInput && saveNameBtn && cancelNameBtn) {
        editNameBtn.addEventListener('click', function() {
            // Show the edit form and hide the name display
            fullNameElement.classList.add('d-none');
            editNameBtn.classList.add('d-none');
            nameEditForm.classList.remove('d-none');
            
            // Set the input value to current name
            nameInput.value = fullNameElement.textContent;
            nameInput.focus();
        });
        
        saveNameBtn.addEventListener('click', function() {
            const newName = nameInput.value.trim();
            if (newName) {
                // Update the displayed name
                fullNameElement.textContent = newName;
                // In a real app, you would save this to the server
                alert('Name updated! (In a real app, this would be saved to the server)');
                
                // Update profile image with new name
                const profileImage = document.getElementById('profileImage');
                if (profileImage) {
                    const nameParts = newName.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
                    const displayName = firstName + (lastName ? '+' + lastName : '');
                    const newSrc = `https://ui-avatars.com/api/?name=${displayName}&background=2E8B57&color=fff&size=128`;
                    profileImage.src = newSrc;
                }
            }
            
            // Hide the edit form and show the name display
            fullNameElement.classList.remove('d-none');
            editNameBtn.classList.remove('d-none');
            nameEditForm.classList.add('d-none');
        });
        
        cancelNameBtn.addEventListener('click', function() {
            // Hide the edit form and show the name display
            fullNameElement.classList.remove('d-none');
            editNameBtn.classList.remove('d-none');
            nameEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveNameBtn.click();
            }
        });
    }
    
    // Add event listeners for email editing
    const editEmailBtn = document.getElementById('editEmailBtn');
    const emailEditForm = document.getElementById('emailEditForm');
    const emailAddressElement = document.getElementById('emailAddress');
    const emailInput = document.getElementById('emailInput');
    const saveEmailBtn = document.getElementById('saveEmailBtn');
    const cancelEmailBtn = document.getElementById('cancelEmailBtn');
    
    if (editEmailBtn && emailEditForm && emailAddressElement && emailInput && saveEmailBtn && cancelEmailBtn) {
        editEmailBtn.addEventListener('click', function() {
            // Show the edit form and hide the email display
            emailAddressElement.classList.add('d-none');
            editEmailBtn.classList.add('d-none');
            emailEditForm.classList.remove('d-none');
            
            // Set the input value to current email
            emailInput.value = emailAddressElement.textContent;
            emailInput.focus();
        });
        
        saveEmailBtn.addEventListener('click', function() {
            const newEmail = emailInput.value.trim();
            if (newEmail) {
                // Update the displayed email
                emailAddressElement.textContent = newEmail;
                // In a real app, you would save this to the server
                alert('Email updated! (In a real app, this would be saved to the server)');
            }
            
            // Hide the edit form and show the email display
            emailAddressElement.classList.remove('d-none');
            editEmailBtn.classList.remove('d-none');
            emailEditForm.classList.add('d-none');
        });
        
        cancelEmailBtn.addEventListener('click', function() {
            // Hide the edit form and show the email display
            emailAddressElement.classList.remove('d-none');
            editEmailBtn.classList.remove('d-none');
            emailEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEmailBtn.click();
            }
        });
    }
    
    // Add event listeners for phone editing
    const editPhoneBtn = document.getElementById('editPhoneBtn');
    const phoneEditForm = document.getElementById('phoneEditForm');
    const phoneNumberElement = document.getElementById('phoneNumber');
    const phoneInput = document.getElementById('phoneInput');
    const savePhoneBtn = document.getElementById('savePhoneBtn');
    const cancelPhoneBtn = document.getElementById('cancelPhoneBtn');
    
    if (editPhoneBtn && phoneEditForm && phoneNumberElement && phoneInput && savePhoneBtn && cancelPhoneBtn) {
        editPhoneBtn.addEventListener('click', function() {
            // Show the edit form and hide the phone display
            phoneNumberElement.classList.add('d-none');
            editPhoneBtn.classList.add('d-none');
            phoneEditForm.classList.remove('d-none');
            
            // Set the input value to current phone
            phoneInput.value = phoneNumberElement.textContent;
            phoneInput.focus();
        });
        
        savePhoneBtn.addEventListener('click', function() {
            const newPhone = phoneInput.value.trim();
            if (newPhone) {
                // Update the displayed phone
                phoneNumberElement.textContent = newPhone;
                // In a real app, you would save this to the server
                alert('Phone number updated! (In a real app, this would be saved to the server)');
            }
            
            // Hide the edit form and show the phone display
            phoneNumberElement.classList.remove('d-none');
            editPhoneBtn.classList.remove('d-none');
            phoneEditForm.classList.add('d-none');
        });
        
        cancelPhoneBtn.addEventListener('click', function() {
            // Hide the edit form and show the phone display
            phoneNumberElement.classList.remove('d-none');
            editPhoneBtn.classList.remove('d-none');
            phoneEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                savePhoneBtn.click();
            }
        });
    }
    
    // Add event listeners for location editing
    const editLocationBtn = document.getElementById('editLocationBtn');
    const locationEditForm = document.getElementById('locationEditForm');
    const userLocationElement = document.getElementById('userLocation');
    const locationInput = document.getElementById('locationInput');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    const cancelLocationBtn = document.getElementById('cancelLocationBtn');
    
    if (editLocationBtn && locationEditForm && userLocationElement && locationInput && saveLocationBtn && cancelLocationBtn) {
        editLocationBtn.addEventListener('click', function() {
            // Show the edit form and hide the location display
            userLocationElement.classList.add('d-none');
            editLocationBtn.classList.add('d-none');
            locationEditForm.classList.remove('d-none');
            
            // Set the input value to current location
            locationInput.value = userLocationElement.textContent;
            locationInput.focus();
        });
        
        saveLocationBtn.addEventListener('click', function() {
            const newLocation = locationInput.value.trim();
            if (newLocation) {
                // Update the displayed location
                userLocationElement.textContent = newLocation;
                // In a real app, you would save this to the server
                alert('Location updated! (In a real app, this would be saved to the server)');
            }
            
            // Hide the edit form and show the location display
            userLocationElement.classList.remove('d-none');
            editLocationBtn.classList.remove('d-none');
            locationEditForm.classList.add('d-none');
        });
        
        cancelLocationBtn.addEventListener('click', function() {
            // Hide the edit form and show the location display
            userLocationElement.classList.remove('d-none');
            editLocationBtn.classList.remove('d-none');
            locationEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveLocationBtn.click();
            }
        });
    }
    
    // Add event listeners for crop editing
    const editCropBtn = document.getElementById('editCropBtn');
    const cropEditForm = document.getElementById('cropEditForm');
    const primaryCropElement = document.getElementById('primaryCrop');
    const cropInput = document.getElementById('cropInput');
    const saveCropBtn = document.getElementById('saveCropBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    
    if (editCropBtn && cropEditForm && primaryCropElement && cropInput && saveCropBtn && cancelCropBtn) {
        editCropBtn.addEventListener('click', function() {
            // Show the edit form and hide the crop display
            primaryCropElement.classList.add('d-none');
            editCropBtn.classList.add('d-none');
            cropEditForm.classList.remove('d-none');
            
            // Set the input value to current crop
            cropInput.value = primaryCropElement.textContent;
            cropInput.focus();
        });
        
        saveCropBtn.addEventListener('click', function() {
            const newCrop = cropInput.value.trim();
            if (newCrop) {
                // Update the displayed crop
                primaryCropElement.textContent = newCrop;
                // In a real app, you would save this to the server
                alert('Primary crop updated! (In a real app, this would be saved to the server)');
            }
            
            // Hide the edit form and show the crop display
            primaryCropElement.classList.remove('d-none');
            editCropBtn.classList.remove('d-none');
            cropEditForm.classList.add('d-none');
        });
        
        cancelCropBtn.addEventListener('click', function() {
            // Hide the edit form and show the crop display
            primaryCropElement.classList.remove('d-none');
            editCropBtn.classList.remove('d-none');
            cropEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        cropInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveCropBtn.click();
            }
        });
    }
    
    // Add event listeners for farm size editing
    const editFarmSizeBtn = document.getElementById('editFarmSizeBtn');
    const farmSizeEditForm = document.getElementById('farmSizeEditForm');
    const farmSizeElement = document.getElementById('farmSize');
    const farmSizeInput = document.getElementById('farmSizeInput');
    const saveFarmSizeBtn = document.getElementById('saveFarmSizeBtn');
    const cancelFarmSizeBtn = document.getElementById('cancelFarmSizeBtn');
    
    if (editFarmSizeBtn && farmSizeEditForm && farmSizeElement && farmSizeInput && saveFarmSizeBtn && cancelFarmSizeBtn) {
        editFarmSizeBtn.addEventListener('click', function() {
            // Show the edit form and hide the farm size display
            farmSizeElement.classList.add('d-none');
            editFarmSizeBtn.classList.add('d-none');
            farmSizeEditForm.classList.remove('d-none');
            
            // Set the input value to current farm size
            farmSizeInput.value = farmSizeElement.textContent;
            farmSizeInput.focus();
        });
        
        saveFarmSizeBtn.addEventListener('click', function() {
            const newFarmSize = farmSizeInput.value.trim();
            if (newFarmSize) {
                // Update the displayed farm size
                farmSizeElement.textContent = newFarmSize;
                // In a real app, you would save this to the server
                alert('Farm size updated! (In a real app, this would be saved to the server)');
            }
            
            // Hide the edit form and show the farm size display
            farmSizeElement.classList.remove('d-none');
            editFarmSizeBtn.classList.remove('d-none');
            farmSizeEditForm.classList.add('d-none');
        });
        
        cancelFarmSizeBtn.addEventListener('click', function() {
            // Hide the edit form and show the farm size display
            farmSizeElement.classList.remove('d-none');
            editFarmSizeBtn.classList.remove('d-none');
            farmSizeEditForm.classList.add('d-none');
        });
        
        // Also save when pressing Enter in the input field
        farmSizeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveFarmSizeBtn.click();
            }
        });
    }
    
    // Fetch and display user profile data
    fetchUserProfile();
}

// Fetch user profile data
function fetchUserProfile() {
    if (!authToken) {
        console.log('No auth token available for profile fetch');
        return;
    }
    
    console.log('Fetching profile data with auth token:', authToken);
    
    fetch('http://localhost:3001/api/protected/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        console.log('Profile API response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Profile API response data:', data);
        if (data.success && data.data && data.data.farmer) {
            const farmer = data.data.farmer;
            document.getElementById('fullName').textContent = farmer.name || 'Not specified';
            document.getElementById('emailAddress').textContent = farmer.email || 'Not specified';
            document.getElementById('phoneNumber').textContent = farmer.phone || 'Not specified';
            document.getElementById('userLocation').textContent = farmer.location || 'Not specified';
            document.getElementById('primaryCrop').textContent = farmer.crop || 'Not specified';
            document.getElementById('farmSize').textContent = farmer.farmSize || 'Not specified';
            
            // Update profile image with user's name
            const profileImage = document.getElementById('profileImage');
            if (profileImage && farmer.name) {
                // Create avatar URL with user's name
                const nameParts = farmer.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
                const displayName = firstName + (lastName ? '+' + lastName : '');
                const newSrc = `https://ui-avatars.com/api/?name=${displayName}&background=2E8B57&color=fff&size=128`;
                profileImage.src = newSrc;
            }
            
            // Format dates
            if (farmer.createdAt) {
                const createdDate = new Date(farmer.createdAt);
                document.getElementById('memberSince').textContent = createdDate.toLocaleDateString();
            }
            
            if (farmer.lastLogin) {
                const loginDate = new Date(farmer.lastLogin);
                document.getElementById('lastLogin').textContent = loginDate.toLocaleDateString();
            }
        } else {
            console.error('Profile data structure is not as expected:', data);
            // Show error message in UI
            document.getElementById('fullName').textContent = 'Error loading profile data';
            document.getElementById('emailAddress').textContent = 'Please try again later';
        }
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
        // Show error message in UI
        document.getElementById('fullName').textContent = 'Error connecting to server';
        document.getElementById('emailAddress').textContent = error.message;
    });
}

// Initialize logout components
function initLogoutComponents() {
    // Add event listeners for logout buttons
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');
    
    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            logoutUser();
        });
    }
    
    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            // Go back to dashboard
            window.location.hash = '#dashboard';
            document.querySelector('[data-page="dashboard"]').click();
        });
    }
}

// Logout user function
function logoutUser() {
    // Clear all session data
    localStorage.removeItem('agrogig_token');
    sessionStorage.clear();
    // Also clear any other stored data
    localStorage.removeItem('preferredLanguage');
    // Redirect to login
    window.location.href = '/login.html';
}