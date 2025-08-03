class DrawingBoard {
    constructor() {
        // State variables
        this.isDrawing = false;
        this.isErasing = false;
        this.isTracingMode = false;
        this.lastPos = { x: 0, y: 0 };
        this.targetText = 'こんにちは';
        this.score = null;
        
        // Canvas dimensions
        this.canvasWidth = 600;
        this.canvasHeight = 350;
        
        // Get DOM elements
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCanvases();
        
        // Update canvas size for mobile
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
    }
    
    initializeElements() {
        // Buttons
        this.freeDrawBtn = document.getElementById('freeDrawBtn');
        this.tracingBtn = document.getElementById('tracingBtn');
        this.eraserBtn = document.getElementById('eraserBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.scoreBtn = document.getElementById('scoreBtn');
        this.setTextBtn = document.getElementById('setTextBtn');
        
        // Input elements
        this.textInput = document.getElementById('textInput');
        this.charCount = document.getElementById('charCount');
        this.currentText = document.getElementById('currentText');
        
        // Sections
        this.textInputSection = document.getElementById('textInputSection');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.scoreValue = document.getElementById('scoreValue');
        this.scoreMessage = document.getElementById('scoreMessage');
        
        // Canvases
        this.drawingCanvas = document.getElementById('drawingCanvas');
        this.templateCanvas = document.getElementById('templateCanvas');
        this.drawingCtx = this.drawingCanvas.getContext('2d');
        this.templateCtx = this.templateCanvas.getContext('2d');
    }
    
    setupEventListeners() {
        // Mode toggle
        this.freeDrawBtn.addEventListener('click', () => this.setMode(false));
        this.tracingBtn.addEventListener('click', () => this.setMode(true));
        
        // Controls
        this.eraserBtn.addEventListener('click', () => this.toggleEraser());
        this.clearBtn.addEventListener('click', () => this.clearCanvas());
        this.scoreBtn.addEventListener('click', () => this.calculateScore());
        this.setTextBtn.addEventListener('click', () => this.setText());
        
        // Text input
        this.textInput.addEventListener('input', (e) => this.handleTextInput(e));
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setText();
        });
        
        // Canvas events - Mouse
        this.drawingCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.drawingCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.drawingCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.drawingCanvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Canvas events - Touch
        this.drawingCanvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.drawingCanvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.drawingCanvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent context menu on canvas
        this.drawingCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    updateCanvasSize() {
        const container = document.querySelector('.canvas-container');
        const containerWidth = container.clientWidth - 40; // Account for padding
        
        if (window.innerWidth < 640) {
            this.canvasWidth = Math.min(containerWidth, 400);
            this.canvasHeight = Math.min(this.canvasWidth * 0.7, 280);
        } else {
            this.canvasWidth = 600;
            this.canvasHeight = 350;
        }
        
        this.drawingCanvas.width = this.canvasWidth;
        this.drawingCanvas.height = this.canvasHeight;
        this.templateCanvas.width = this.canvasWidth;
        this.templateCanvas.height = this.canvasHeight;
        
        this.initializeCanvases();
        if (this.isTracingMode) {
            this.drawTemplateText();
        }
    }
    
    initializeCanvases() {
        // Initialize drawing canvas
        this.drawingCtx.fillStyle = '#f9fafb';
        this.drawingCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Clear template canvas
        this.templateCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    
    setMode(isTracing) {
        this.isTracingMode = isTracing;
        
        // Update button states
        this.freeDrawBtn.classList.toggle('active', !isTracing);
        this.tracingBtn.classList.toggle('active', isTracing);
        
        // Show/hide sections
        this.textInputSection.classList.toggle('hidden', !isTracing);
        this.scoreBtn.classList.toggle('hidden', !isTracing);
        
        // Clear canvas and score
        this.clearCanvas();
        this.hideScore();
        
        // Draw template if in tracing mode
        if (isTracing) {
            this.drawTemplateText();
        }
    }
    
    toggleEraser() {
        this.isErasing = !this.isErasing;
        this.eraserBtn.classList.toggle('active', this.isErasing);
        this.eraserBtn.innerHTML = `
            <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
                <path d="M22 21H7"/>
                <path d="m5 11 9 9"/>
            </svg>
            ${this.isErasing ? '描画' : '消しゴム'}
        `;
    }
    
    clearCanvas() {
        this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawingCtx.fillStyle = '#f9fafb';
        this.drawingCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.hideScore();
    }
    
    handleTextInput(e) {
        const value = e.target.value;
        this.charCount.textContent = value.length;
        this.setTextBtn.disabled = !value.trim();
    }
    
    setText() {
        const text = this.textInput.value.trim();
        if (text) {
            this.targetText = text;
            this.currentText.textContent = text;
            this.textInput.value = '';
            this.charCount.textContent = '0';
            this.setTextBtn.disabled = true;
            this.clearCanvas();
            this.drawTemplateText();
        }
    }
    
    drawTemplateText() {
        if (!this.isTracingMode) return;
        
        this.templateCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.templateCtx.fillStyle = 'rgba(255, 107, 79, 0.3)';
        this.templateCtx.strokeStyle = '#ff6b4f';
        this.templateCtx.lineWidth = 2;
        
        // Calculate font size based on text length and canvas size
        const textLength = this.targetText.length;
        let fontSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.4;
        if (textLength > 5) {
            fontSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.3;
        }
        if (textLength > 8) {
            fontSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.25;
        }
        
        this.templateCtx.font = `${fontSize}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif`;
        this.templateCtx.textAlign = 'center';
        this.templateCtx.textBaseline = 'middle';
        
        // Measure text to ensure it fits
        const textMetrics = this.templateCtx.measureText(this.targetText);
        const textWidth = textMetrics.width;
        
        // Scale down if text is too wide
        if (textWidth > this.canvasWidth * 0.9) {
            const scale = (this.canvasWidth * 0.9) / textWidth;
            fontSize *= scale;
            this.templateCtx.font = `${fontSize}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif`;
        }
        
        // Draw text outline and fill
        this.templateCtx.strokeText(this.targetText, this.canvasWidth / 2, this.canvasHeight / 2);
        this.templateCtx.fillText(this.targetText, this.canvasWidth / 2, this.canvasHeight / 2);
    }
    
    getPosition(e) {
        const rect = this.drawingCanvas.getBoundingClientRect();
        const scaleX = this.drawingCanvas.width / rect.width;
        const scaleY = this.drawingCanvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    startDrawing(pos) {
        this.isDrawing = true;
        this.lastPos = pos;
    }
    
    draw(pos) {
        if (!this.isDrawing) return;
        
        this.drawingCtx.lineWidth = this.isErasing ? 20 : 4;
        this.drawingCtx.lineCap = 'round';
        this.drawingCtx.lineJoin = 'round';
        
        if (this.isErasing) {
            this.drawingCtx.globalCompositeOperation = 'destination-out';
        } else {
            this.drawingCtx.globalCompositeOperation = 'source-over';
            this.drawingCtx.strokeStyle = '#1f2937';
        }
        
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(this.lastPos.x, this.lastPos.y);
        this.drawingCtx.lineTo(pos.x, pos.y);
        this.drawingCtx.stroke();
        
        this.lastPos = pos;
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    // Mouse event handlers
    handleMouseDown(e) {
        e.preventDefault();
        const pos = this.getPosition(e);
        this.startDrawing(pos);
    }
    
    handleMouseMove(e) {
        e.preventDefault();
        const pos = this.getPosition(e);
        this.draw(pos);
    }
    
    handleMouseUp(e) {
        e.preventDefault();
        this.stopDrawing();
    }
    
    // Touch event handlers
    handleTouchStart(e) {
        e.preventDefault();
        const pos = this.getPosition(e);
        this.startDrawing(pos);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const pos = this.getPosition(e);
        this.draw(pos);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.stopDrawing();
    }
    
    calculateScore() {
        if (!this.isTracingMode) return;
        
        // Get image data
        const userDrawing = this.drawingCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const template = this.templateCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        
        let matchingPixels = 0;
        let totalTemplatePixels = 0;
        let totalUserPixels = 0;
        
        // Count pixels
        for (let i = 0; i < template.data.length; i += 4) {
            const templateAlpha = template.data[i + 3];
            const userAlpha = userDrawing.data[i + 3];
            
            if (templateAlpha > 0) {
                totalTemplatePixels++;
                if (userAlpha > 0) {
                    matchingPixels++;
                }
            }
            if (userAlpha > 0) {
                totalUserPixels++;
            }
        }
        
        // Calculate score based on overlap and accuracy
        const coverage = totalTemplatePixels > 0 ? matchingPixels / totalTemplatePixels : 0;
        const precision = totalUserPixels > 0 ? matchingPixels / totalUserPixels : 0;
        const finalScore = Math.round((coverage * 0.7 + precision * 0.3) * 100);
        
        this.score = Math.max(0, Math.min(100, finalScore));
        this.showScore();
    }
    
    showScore() {
        this.scoreDisplay.classList.remove('hidden');
        this.scoreValue.textContent = `${this.score}点`;
        
        // Remove previous color classes
        this.scoreValue.classList.remove('score-excellent', 'score-good', 'score-poor');
        
        // Add appropriate color class and message
        if (this.score >= 80) {
            this.scoreValue.classList.add('score-excellent');
            this.scoreMessage.textContent = this.score >= 90 ? '素晴らしい！' : 'とても上手！';
        } else if (this.score >= 60) {
            this.scoreValue.classList.add('score-good');
            this.scoreMessage.textContent = '良くできました';
        } else {
            this.scoreValue.classList.add('score-poor');
            this.scoreMessage.textContent = this.score >= 40 ? 'もう少し頑張って' : '練習を続けましょう';
        }
    }
    
    hideScore() {
        this.scoreDisplay.classList.add('hidden');
        this.score = null;
    }
}

// Initialize the drawing board when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DrawingBoard();
});
