class ResumeParser {
    constructor() {
        this.sections = {
            education: [],
            experience: [],
            skills: [],
            projects: []
        };
    }

    async parseFile(file) {
        try {
            const text = await this.readFile(file);
            return this.parseText(text);
        } catch (error) {
            console.error('Error parsing file:', error);
            throw error;
        }
    }

    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    parseText(text) {
        // Split text into sections
        const sections = this.identifySections(text);
        
        // Parse each section
        this.parseEducation(sections.education);
        this.parseExperience(sections.experience);
        this.parseSkills(sections.skills);
        this.parseProjects(sections.projects);

        return this.createStoryline();
    }

    identifySections(text) {
        const sections = {
            education: '',
            experience: '',
            skills: '',
            projects: ''
        };

        // Simple section identification based on common headers
        const lines = text.split('\n');
        let currentSection = null;

        for (const line of lines) {
            const cleanLine = line.toLowerCase().trim();

            if (cleanLine.includes('education') || cleanLine.includes('academic')) {
                currentSection = 'education';
                continue;
            } else if (cleanLine.includes('experience') || cleanLine.includes('work')) {
                currentSection = 'experience';
                continue;
            } else if (cleanLine.includes('skills') || cleanLine.includes('technologies')) {
                currentSection = 'skills';
                continue;
            } else if (cleanLine.includes('projects') || cleanLine.includes('portfolio')) {
                currentSection = 'projects';
                continue;
            }

            if (currentSection && line.trim()) {
                sections[currentSection] += line + '\n';
            }
        }

        return sections;
    }

    parseEducation(text) {
        const entries = text.split('\n\n');
        
        this.sections.education = entries.map(entry => {
            const lines = entry.split('\n');
            return {
                degree: lines[0] || '',
                school: lines[1] || '',
                year: this.extractYear(entry),
                achievements: this.extractBulletPoints(entry)
            };
        }).filter(entry => entry.degree || entry.school);
    }

    parseExperience(text) {
        const entries = text.split('\n\n');
        
        this.sections.experience = entries.map(entry => {
            const lines = entry.split('\n');
            return {
                title: lines[0] || '',
                company: lines[1] || '',
                period: this.extractDateRange(entry),
                responsibilities: this.extractBulletPoints(entry)
            };
        }).filter(entry => entry.title || entry.company);
    }

    parseSkills(text) {
        const skillLines = text.split('\n');
        const skillGroups = {};

        skillLines.forEach(line => {
            if (line.trim()) {
                const skills = line.split(/[,:]/).map(skill => skill.trim());
                if (skills.length > 1) {
                    skillGroups[skills[0]] = skills.slice(1);
                } else {
                    if (!skillGroups['General']) skillGroups['General'] = [];
                    skillGroups['General'].push(skills[0]);
                }
            }
        });

        this.sections.skills = skillGroups;
    }

    parseProjects(text) {
        const entries = text.split('\n\n');
        
        this.sections.projects = entries.map(entry => {
            const lines = entry.split('\n');
            return {
                name: lines[0] || '',
                description: lines[1] || '',
                technologies: this.extractTechnologies(entry),
                achievements: this.extractBulletPoints(entry)
            };
        }).filter(entry => entry.name);
    }

    extractYear(text) {
        const yearRegex = /(19|20)\d{2}/g;
        const matches = text.match(yearRegex);
        return matches ? matches[0] : '';
    }

    extractDateRange(text) {
        const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\w,]*(19|20)\d{2}/g;
        const matches = text.match(dateRegex);
        return matches ? matches.join(' - ') : '';
    }

    extractBulletPoints(text) {
        const bulletPoints = [];
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                bulletPoints.push(trimmed.substring(1).trim());
            }
        });

        return bulletPoints;
    }

    extractTechnologies(text) {
        const techRegex = /\b(JavaScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|SQL|AWS|Docker|Git|HTML|CSS)\b/g;
        const matches = text.match(techRegex);
        return matches || [];
    }

    createStoryline() {
        return {
            intro: this.createIntroduction(),
            chapters: [
                ...this.createEducationChapters(),
                ...this.createExperienceChapters(),
                ...this.createSkillsChapters(),
                ...this.createProjectsChapters()
            ]
        };
    }

    createIntroduction() {
        const experience = this.sections.experience[0];
        const education = this.sections.education[0];
        
        return {
            title: "The Journey Begins",
            content: `Our hero's journey began at ${education?.school || 'school'}, 
                     pursuing ${education?.degree || 'knowledge'}. 
                     Now, they're a ${experience?.title || 'professional'} 
                     at ${experience?.company || 'their company'}.`
        };
    }

    createEducationChapters() {
        return this.sections.education.map(edu => ({
            type: 'education',
            title: `Learning at ${edu.school}`,
            period: edu.year,
            content: edu.degree,
            achievements: edu.achievements,
            scene: {
                background: 'school',
                props: ['books', 'diploma', 'classroom']
            }
        }));
    }

    createExperienceChapters() {
        return this.sections.experience.map(exp => ({
            type: 'experience',
            title: `${exp.title} at ${exp.company}`,
            period: exp.period,
            content: exp.responsibilities.join(' '),
            achievements: exp.responsibilities,
            scene: {
                background: 'office',
                props: ['desk', 'computer', 'coffee']
            }
        }));
    }

    createSkillsChapters() {
        return Object.entries(this.sections.skills).map(([category, skills]) => ({
            type: 'skills',
            title: `Mastering ${category}`,
            content: `Acquired powerful abilities in ${skills.join(', ')}`,
            skills: skills,
            scene: {
                background: 'laboratory',
                props: ['books', 'tools', 'computer']
            }
        }));
    }

    createProjectsChapters() {
        return this.sections.projects.map(project => ({
            type: 'project',
            title: project.name,
            content: project.description,
            technologies: project.technologies,
            achievements: project.achievements,
            scene: {
                background: 'workshop',
                props: ['blueprint', 'tools', 'prototype']
            }
        }));
    }
}

// Export the parser
window.ResumeParser = ResumeParser; 