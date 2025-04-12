# Interactive Resume Timeline

A fun and interactive way to showcase your resume, inspired by classic side-scrolling video games. This project creates an engaging experience where visitors can navigate through different sections of your resume using keyboard controls, scroll, or touch gestures.

## Features

- Interactive character that moves through resume sections
- Animated transitions and movements
- Responsive design that works on desktop and mobile devices
- Skills visualization with level indicators
- Experience timeline with animated elements
- Contact section with social media links
- Keyboard, mouse, and touch controls

## How to Use

1. Clone this repository
2. Replace the example resume data in `src/js/main.js` with your own information
3. Customize the styling in `src/css/style.css` to match your preferences
4. Add your own images to the `src/images` directory
5. Deploy to your preferred hosting platform

## Resume Data Structure

Update the `exampleResumeData` object in `main.js` with your information:

```javascript
{
    name: "Your Name",
    location: "Your Location",
    skills: [
        { 
            name: "Skill Name",
            level: 90, // 0-100
            icon: "🔵" // emoji or image path
        }
        // Add more skills...
    ],
    experience: [
        {
            title: "Job Title",
            company: "Company Name",
            date: "Date Range",
            description: "Job Description"
        }
        // Add more experiences...
    ],
    contact: {
        email: "your@email.com",
        social: [
            {
                platform: "Platform Name",
                url: "Profile URL",
                icon: "icon-path.png"
            }
            // Add more social links...
        ]
    }
}
```

## Controls

- **Keyboard**:
  - Arrow Right: Move forward
  - Arrow Left: Move backward
  - Arrow Up: Jump
- **Mouse**: Scroll to navigate
- **Touch**: 
  - Swipe left/right to move
  - Swipe up to jump

## Customization

### Colors
You can customize the colors by modifying the CSS variables in `style.css`:

```css
:root {
    --primary-color: #00bff3;
    --secondary-color: #ed1c24;
    --text-color: #333;
    --background-color: #87ceeb;
    --ground-color: #90EE90;
    --building-color: #808080;
}
```

### Character
To customize the character appearance, modify the `#character` styles in `style.css` or replace with your own character sprite.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Dependencies

No external dependencies required! This project uses vanilla JavaScript, CSS, and HTML.

## License

MIT License - feel free to use this for your own resume! 