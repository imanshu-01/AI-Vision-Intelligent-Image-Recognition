// Main Application
class CIFAR10Classifier {
    constructor() {
        this.chart = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.uploadedImage = null;
        this.classColors = {};
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing CIFAR-10 Classifier...');
        
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Initialize components
        this.initParticles();
        this.initEventListeners();
        this.initChart();
        this.loadClasses();
        this.loadModelInfo();
        
        // Check server connection
        await this.checkServer();
        
        console.log('✅ Application initialized successfully!');
    }

    initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
                color: { value: this.currentTheme === 'dark' ? '#ffffff' : '#000000' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out'
                }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' }
                }
            }
        });
    }

    initEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // File upload
        const fileInput = document.getElementById('imageInput');
        const uploadCard = document.getElementById('uploadCard');
        
        // Click to upload
        uploadCard.addEventListener('click', (e) => {
            if (!e.target.closest('.upload-buttons')) {
                fileInput.click();
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadCard.addEventListener(eventName, () => {
                uploadCard.style.borderColor = '#10b981';
                uploadCard.style.transform = 'scale(1.02)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, () => {
                uploadCard.style.borderColor = '#6366f1';
                uploadCard.style.transform = 'scale(1)';
            }, false);
        });

        uploadCard.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileSelect(file);
            } else {
                this.showToast('Please drop an image file', 'error');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + O to open file dialog
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                fileInput.click();
            }
            
            // Escape to clear
            if (e.key === 'Escape') {
                this.clearImage();
            }
        });
    }

    initChart() {
        const ctx = document.getElementById('probabilityChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Probability (%)',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => `${value}%`
                        }
                    }
                }
            }
        });
    }

    async loadClasses() {
        try {
            const response = await fetch('/api/model-info');
            const data = await response.json();
            
            if (data.success) {
                this.classColors = {};
                const classesGrid = document.getElementById('classesGrid');
                classesGrid.innerHTML = '';
                
                Object.entries(data.classes).forEach(([key, info]) => {
                    this.classColors[key] = info.color;
                    
                    const classCard = document.createElement('div');
                    classCard.className = 'class-card';
                    classCard.innerHTML = `
                        <div class="class-emoji">${info.emoji}</div>
                        <h3 class="class-name">${info.name}</h3>
                        <p class="class-desc">${info.description}</p>
                    `;
                    classCard.style.borderColor = info.color;
                    
                    classesGrid.appendChild(classCard);
                });
            }
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    }

    async loadModelInfo() {
        try {
            const response = await fetch('/api/model-info');
            const data = await response.json();
            
            if (data.success && data.model_loaded) {
                document.getElementById('modelAccuracy').textContent = '85%+ (Trained)';
            } else {
                document.getElementById('modelAccuracy').textContent = 'Using default model';
            }
        } catch (error) {
            console.error('Error loading model info:', error);
        }
    }

    async checkServer() {
        try {
            const response = await fetch('/api/model-info');
            if (response.ok) {
                console.log('✅ Server connection established');
            }
        } catch (error) {
            console.warn('⚠️ Server connection failed:', error);
            this.showToast('Server connection issue. Trying local mode...', 'warning');
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update particles color
        if (window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom[0].pJS.particles.color.value = theme === 'dark' ? '#ffffff' : '#000000';
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`Switched to ${newTheme} theme`, 'info');
    }

    handleFileSelect(file) {
        if (!file) return;
        
        // Validate file
        if (file.size > 16 * 1024 * 1024) {
            this.showToast('File size exceeds 16MB limit', 'error');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }
        
        // Show upload progress
        const progressBar = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.display = 'block';
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                progressBar.style.display = 'none';
                
                // Preview image
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImage = file;
                    this.showImagePreview(e.target.result);
                    this.showToast('Image uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        }, 50);
    }

    showImagePreview(dataUrl) {
        const preview = document.getElementById('imagePreview');
        const uploadCard = document.getElementById('uploadCard');
        const resultsSection = document.getElementById('resultsSection');
        
        preview.src = dataUrl;
        uploadCard.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    clearImage() {
        const uploadCard = document.getElementById('uploadCard');
        const resultsSection = document.getElementById('resultsSection');
        const fileInput = document.getElementById('imageInput');
        
        this.uploadedImage = null;
        fileInput.value = '';
        uploadCard.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Reset results
        this.resetResults();
        this.showToast('Image cleared', 'info');
    }

    resetResults() {
        // Reset top prediction
        document.getElementById('topPrediction').innerHTML = `
            <div class="prediction-emoji">🤖</div>
            <div class="prediction-details">
                <h4 class="prediction-class">Waiting for analysis...</h4>
                <p class="prediction-desc">Upload an image to begin</p>
            </div>
        `;
        
        document.getElementById('topConfidence').textContent = '0%';
        document.getElementById('meterFill').style.width = '0%';
        document.getElementById('otherPredictions').innerHTML = '';
        document.getElementById('probabilityList').innerHTML = '';
        
        // Reset chart
        if (this.chart) {
            this.chart.data.labels = [];
            this.chart.data.datasets[0].data = [];
            this.chart.data.datasets[0].backgroundColor = [];
            this.chart.update();
        }
    }

    async analyzeImage() {
        if (!this.uploadedImage) {
            this.showToast('Please upload an image first', 'warning');
            return;
        }
        
        // Show loading
        const loadingIndicator = document.getElementById('loadingIndicator');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        loadingIndicator.style.display = 'flex';
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        try {
            const formData = new FormData();
            formData.append('file', this.uploadedImage);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data);
                this.showToast('Analysis complete!', 'success');
            } else {
                throw new Error(data.error || 'Analysis failed');
            }
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast(`Analysis failed: ${error.message}`, 'error');
            
            // Try with test prediction
            await this.useTestPrediction();
            
        } finally {
            loadingIndicator.style.display = 'none';
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-play"></i> Start Analysis';
        }
    }

    displayResults(data) {
        const topPrediction = data.top_predictions[0];
        
        // Update top prediction
        document.getElementById('topPrediction').innerHTML = `
            <div class="prediction-emoji">${topPrediction.emoji}</div>
            <div class="prediction-details">
                <h4 class="prediction-class">${topPrediction.class}</h4>
                <p class="prediction-desc">${topPrediction.description}</p>
            </div>
        `;
        
        // Update confidence
        document.getElementById('topConfidence').textContent = `${topPrediction.confidence}%`;
        document.getElementById('meterFill').style.width = `${topPrediction.confidence}%`;
        document.getElementById('meterFill').style.background = topPrediction.color;
        
        // Update other predictions
        const otherPredictions = document.getElementById('otherPredictions');
        otherPredictions.innerHTML = '';
        
        data.top_predictions.slice(1).forEach(pred => {
            const predictionItem = document.createElement('div');
            predictionItem.className = 'prediction-item';
            predictionItem.innerHTML = `
                <div class="prediction-item-emoji">${pred.emoji}</div>
                <div class="prediction-item-details">
                    <div class="prediction-item-class">${pred.class}</div>
                    <div class="prediction-item-bar">
                        <div class="prediction-item-fill" style="width: ${pred.confidence}%; background: ${pred.color};"></div>
                    </div>
                </div>
                <div class="prediction-item-value" style="color: ${pred.color};">${pred.confidence}%</div>
            `;
            otherPredictions.appendChild(predictionItem);
        });
        
        // Update chart
        this.updateChart(data.all_probabilities);
        
        // Update probability list
        this.updateProbabilityList(data.all_probabilities);
    }

    updateChart(probabilities) {
        const labels = probabilities.map(p => p.class);
        const data = probabilities.map(p => p.probability);
        const colors = probabilities.map(p => p.color);
        
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.data.datasets[0].borderColor = colors;
        this.chart.update();
    }

    updateProbabilityList(probabilities) {
        const probabilityList = document.getElementById('probabilityList');
        probabilityList.innerHTML = '';
        
        probabilities.forEach((prob, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'probability-item';
            listItem.innerHTML = `
                <div class="prediction-item">
                    <div class="prediction-item-emoji" style="background: ${prob.color}20; color: ${prob.color}; padding: 8px; border-radius: 8px;">
                        ${index + 1}
                    </div>
                    <div class="prediction-item-details">
                        <div class="prediction-item-class">${prob.class}</div>
                        <div class="prediction-item-bar">
                            <div class="prediction-item-fill" style="width: ${prob.probability}%; background: ${prob.color};"></div>
                        </div>
                    </div>
                    <div class="prediction-item-value" style="color: ${prob.color};">${prob.probability.toFixed(1)}%</div>
                </div>
            `;
            probabilityList.appendChild(listItem);
        });
    }

    async useTestPrediction() {
        try {
            const response = await fetch('/api/test-prediction');
            const data = await response.json();
            
            if (data.success) {
                // Create mock data for display
                const mockData = {
                    top_predictions: [{
                        class: data.prediction.class,
                        emoji: data.prediction.emoji,
                        confidence: data.prediction.confidence,
                        color: '#6366f1',
                        description: 'Test prediction using random input'
                    }],
                    all_probabilities: Object.keys(this.classColors).map(key => ({
                        class: key,
                        probability: Math.random() * 100,
                        color: this.classColors[key]
                    })).sort((a, b) => b.probability - a.probability)
                };
                
                this.displayResults(mockData);
                this.showToast('Using test prediction (no image uploaded)', 'warning');
            }
        } catch (error) {
            console.error('Test prediction failed:', error);
        }
    }

    async useSampleImage() {
        // Sample images for testing
        const sampleImages = [
            'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop'
        ];
        
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        
        // Fetch the image
        try {
            const response = await fetch(randomImage);
            const blob = await response.blob();
            
            // Create a file from blob
            const file = new File([blob], 'sample-image.jpg', { type: 'image/jpeg' });
            this.uploadedImage = file;
            
            // Show preview
            this.showImagePreview(randomImage);
            this.showToast('Sample image loaded! Click "Start Analysis" to test.', 'success');
            
        } catch (error) {
            console.error('Error loading sample image:', error);
            this.showToast('Failed to load sample image', 'error');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="toast-message">${message}</div>
            <button class="btn-icon" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Show with animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Global functions for HTML onclick events
function openFilePicker() {
    document.getElementById('imageInput').click();
}

function useSampleImage() {
    if (window.classifier) {
        window.classifier.useSampleImage();
    }
}

function analyzeImage() {
    if (window.classifier) {
        window.classifier.analyzeImage();
    }
}

function clearImage() {
    if (window.classifier) {
        window.classifier.clearImage();
    }
}

function showInfoModal() {
    document.getElementById('infoModal').style.display = 'flex';
}

function hideInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function toggleChartView() {
    const chartCanvas = document.getElementById('probabilityChart');
    const probabilityList = document.getElementById('probabilityList');
    
    if (chartCanvas.style.display === 'none') {
        chartCanvas.style.display = 'block';
        probabilityList.style.display = 'none';
    } else {
        chartCanvas.style.display = 'none';
        probabilityList.style.display = 'block';
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.classifier = new CIFAR10Classifier();
});