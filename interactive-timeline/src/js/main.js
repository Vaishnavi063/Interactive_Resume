// Resume Data Structure
const resumeData = {
    name: '',
    location: '',
    skills: [],
    experience: [],
    contact: {
        email: '',
        social: []
    }
};

// Game State
const gameState = {
    character: {
        position: 0,
        isJumping: false,
        isMoving: false
    },
    currentSection: 0,
    sections: ['header', 'about', 'skills', 'experience', 'contact']
};

// DOM Elements
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const sections = document.querySelectorAll('.section');

// Initialize the game
function initGame(data) {
    resumeData.name = data.name;
    resumeData.location = data.location;
    resumeData.skills = data.skills;
    resumeData.experience = data.experience;
    resumeData.contact = data.contact;

    updateUI();
    setupEventListeners();
    startGameLoop();
}

// Update UI with resume data
function updateUI() {
    // Update name
    document.getElementById('user-name').textContent = resumeData.name;
    document.getElementById('user-location').textContent = resumeData.location;

    // Update skills
    const skillsGrid = document.querySelector('.skills-grid');
    skillsGrid.innerHTML = resumeData.skills.map(skill => `
        <div class="skill-item">
            <div class="skill-level" style="height: ${skill.level}%">
                <div class="skill-icon">${skill.icon}</div>
            </div>
            <h3>${skill.name}</h3>
        </div>
    `).join('');

    // Update experience
    const experienceTimeline = document.querySelector('.experience-timeline');
    experienceTimeline.innerHTML = resumeData.experience.map(exp => `
        <div class="experience-item">
            <h3>${exp.title}</h3>
            <h4>${exp.company}</h4>
            <p class="date">${exp.date}</p>
            <p>${exp.description}</p>
        </div>
    `).join('');

    // Update social links
    const socialLinks = document.querySelector('.social-links');
    socialLinks.innerHTML = resumeData.contact.social.map(social => `
        <a href="${social.url}" target="_blank" class="social-link">
            <img src="${social.icon}" alt="${social.platform}">
        </a>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Scroll controls
    window.addEventListener('scroll', handleScroll);
    
    // Touch controls for mobile
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}

// Handle keyboard input
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
            moveCharacter('right');
            break;
        case 'ArrowLeft':
            moveCharacter('left');
            break;
        case 'ArrowUp':
            jump();
            break;
    }
}

// Character movement
function moveCharacter(direction) {
    if (gameState.character.isMoving) return;
    
    gameState.character.isMoving = true;
    const currentPos = gameState.character.position;
    
    if (direction === 'right' && currentPos < sections.length - 1) {
        gameState.character.position++;
    } else if (direction === 'left' && currentPos > 0) {
        gameState.character.position--;
    }
    
    updateCharacterPosition();
}

// Character jump animation
function jump() {
    if (gameState.character.isJumping) return;
    
    gameState.character.isJumping = true;
    character.classList.add('jumping');
    
    setTimeout(() => {
        character.classList.remove('jumping');
        gameState.character.isJumping = false;
    }, 500);
}

// Update character position
function updateCharacterPosition() {
    const targetSection = sections[gameState.character.position];
    const targetPos = targetSection.offsetLeft + (targetSection.offsetWidth / 2);
    
    character.style.left = `${targetPos}px`;
    
    setTimeout(() => {
        gameState.character.isMoving = false;
    }, 300);
}

// Handle scroll events
function handleScroll() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (scrollPos >= sectionTop - windowHeight/2) {
            gameState.currentSection = index;
            updateCharacterPosition();
        }
    });
}

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            moveCharacter('right');
        } else {
            moveCharacter('left');
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            // Swipe up
            jump();
        }
    }
    
    touchStartX = null;
    touchStartY = null;
}

function handleTouchEnd() {
    touchStartX = null;
    touchStartY = null;
}

// Game loop
function startGameLoop() {
    function gameLoop() {
        // Update character animations
        if (gameState.character.isMoving) {
            character.classList.add('moving');
        } else {
            character.classList.remove('moving');
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Example resume data
const exampleResumeData = {
    name: "John Doe",
    location: "New York City",
    skills: [
        { name: "JavaScript", level: 90, icon: "🟡" },
        { name: "HTML/CSS", level: 85, icon: "🔵" },
        { name: "React", level: 80, icon: "⚛️" },
        { name: "Node.js", level: 75, icon: "🟢" },
        { name: "Python", level: 70, icon: "🐍" }
    ],
    experience: [
        {
            title: "Senior Developer",
            company: "Tech Corp",
            date: "2020-Present",
            description: "Leading development team on various projects."
        },
        {
            title: "Web Developer",
            company: "Digital Agency",
            date: "2018-2020",
            description: "Developed responsive web applications."
        }
    ],
    contact: {
        email: "john@example.com",
        social: [
            {
                platform: "LinkedIn",
                url: "https://linkedin.com/in/johndoe",
                icon: "linkedin-icon.png"
            },
            {
                platform: "GitHub",
                url: "https://github.com/johndoe",
                icon: "github-icon.png"
            }
        ]
    }
};

// Initialize the game with example data
// In a real application, you would replace this with actual user data
document.addEventListener('DOMContentLoaded', () => {
    initGame(exampleResumeData);
}); 