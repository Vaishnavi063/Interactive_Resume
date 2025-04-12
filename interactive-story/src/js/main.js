class InteractiveStory {
    constructor() {
        this.currentChapter = 0;
        this.storyline = null;
        this.isAnimating = false;
        this.robby = null;
        this.parser = new ResumeParser();
        
        this.init();
    }

    init() {
        // Initialize DOM elements
        this.robby = document.getElementById('robby');
        this.storyContainer = document.getElementById('story-container');
        this.timelinePath = document.getElementById('timeline-path');
        this.uploadModal = document.getElementById('upload-modal');
        
        // Bind event listeners
        this.bindEvents();
        
        // Show upload modal
        this.showUploadModal();
        
        // Initialize parallax effect
        this.initParallax();
    }

    bindEvents() {
        // Navigation controls
        document.getElementById('prev-btn').addEventListener('click', () => this.navigate('prev'));
        document.getElementById('next-btn').addEventListener('click', () => this.navigate('next'));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate('prev');
            if (e.key === 'ArrowRight') this.navigate('next');
        });
        
        // File upload handling
        document.getElementById('resume-upload').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('resume-text').addEventListener('input', (e) => this.handleTextInput(e));
        document.getElementById('parse-btn').addEventListener('click', () => this.parseResume());
        
        // Touch events for mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.navigate('next');
                else this.navigate('prev');
            }
        });
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            this.storyline = await this.parser.parseFile(file);
            this.hideUploadModal();
            this.startStory();
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing resume file. Please try again.');
        }
    }

    handleTextInput(event) {
        const text = event.target.value;
        if (!text) return;
        
        try {
            this.storyline = this.parser.parseText(text);
        } catch (error) {
            console.error('Error parsing text:', error);
        }
    }

    parseResume() {
        const text = document.getElementById('resume-text').value;
        if (!text) {
            alert('Please enter your resume text or upload a file.');
            return;
        }
        
        try {
            this.storyline = this.parser.parseText(text);
            this.hideUploadModal();
            this.startStory();
        } catch (error) {
            console.error('Error parsing resume:', error);
            alert('Error parsing resume text. Please try again.');
        }
    }

    showUploadModal() {
        this.uploadModal.style.display = 'flex';
    }

    hideUploadModal() {
        this.uploadModal.style.display = 'none';
    }

    startStory() {
        if (!this.storyline) return;
        
        // Create timeline nodes
        this.createTimelineNodes();
        
        // Show introduction
        this.showChapter(0);
        
        // Start background animations
        this.startBackgroundAnimations();
    }

    createTimelineNodes() {
        const totalChapters = this.storyline.chapters.length;
        const pathLength = this.timelinePath.getTotalLength();
        
        this.storyline.chapters.forEach((chapter, index) => {
            const node = document.createElement('div');
            node.className = 'timeline-node';
            node.dataset.chapter = index;
            
            // Position node along the path
            const point = this.timelinePath.getPointAtLength((pathLength * (index + 1)) / (totalChapters + 1));
            node.style.left = `${point.x}px`;
            node.style.top = `${point.y}px`;
            
            node.addEventListener('click', () => this.showChapter(index));
            this.timelinePath.parentNode.appendChild(node);
        });
    }

    async showChapter(index) {
        if (this.isAnimating || index < 0 || index >= this.storyline.chapters.length) return;
        
        this.isAnimating = true;
        const chapter = this.storyline.chapters[index];
        
        // Update timeline nodes
        document.querySelectorAll('.timeline-node').forEach((node, i) => {
            node.classList.toggle('active', i === index);
        });
        
        // Move Robby to the new position
        await this.moveRobbyToChapter(index);
        
        // Update chapter content
        this.updateChapterContent(chapter);
        
        // Update scene
        this.updateScene(chapter.scene);
        
        this.currentChapter = index;
        this.isAnimating = false;
    }

    async moveRobbyToChapter(index) {
        const node = document.querySelector(`.timeline-node[data-chapter="${index}"]`);
        const robbyRect = this.robby.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        
        const deltaX = nodeRect.left - robbyRect.left;
        const deltaY = nodeRect.top - robbyRect.top;
        
        // Add walking animation class
        this.robby.classList.add('walking');
        
        // Move Robby
        this.robby.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove walking animation
        this.robby.classList.remove('walking');
    }

    updateChapterContent(chapter) {
        const contentContainer = document.getElementById('chapter-content');
        contentContainer.innerHTML = `
            <h2>${chapter.title}</h2>
            <p>${chapter.content}</p>
            ${chapter.achievements ? `
                <ul>
                    ${chapter.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        
        // Fade in new content
        contentContainer.style.opacity = 0;
        setTimeout(() => {
            contentContainer.style.opacity = 1;
        }, 100);
    }

    updateScene(scene) {
        // Update background
        document.querySelectorAll('.parallax-layer').forEach(layer => {
            layer.style.backgroundImage = `url('assets/backgrounds/${scene.background}/${layer.dataset.layer}.png')`;
        });
        
        // Update props
        const propsContainer = document.getElementById('props-container');
        propsContainer.innerHTML = scene.props.map(prop => `
            <img src="assets/props/${prop}.png" class="scene-prop" alt="${prop}">
        `).join('');
    }

    navigate(direction) {
        const nextIndex = direction === 'next' 
            ? this.currentChapter + 1 
            : this.currentChapter - 1;
            
        this.showChapter(nextIndex);
    }

    initParallax() {
        window.addEventListener('mousemove', (e) => {
            const layers = document.querySelectorAll('.parallax-layer');
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            layers.forEach(layer => {
                const speed = layer.dataset.speed || 1;
                const x = (deltaX * speed) / 100;
                const y = (deltaY * speed) / 100;
                layer.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    startBackgroundAnimations() {
        // Animate clouds
        setInterval(() => {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = `${Math.random() * 50}%`;
            document.querySelector('.parallax-layer[data-layer="sky"]').appendChild(cloud);
            
            setTimeout(() => cloud.remove(), 20000);
        }, 10000);
        
        // Animate stars (at night)
        setInterval(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            document.querySelector('.parallax-layer[data-layer="stars"]').appendChild(star);
            
            setTimeout(() => star.remove(), 2000);
        }, 1000);
    }
}

// Initialize the story when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveStory = new InteractiveStory();
}); 