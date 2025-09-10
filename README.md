# Temple Website

A modern, responsive website template inspired by the Sri Venkataramana Temple design.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Layout**: Clean, professional design with temple-inspired colors
- **Image Placeholders**: Ready-to-use placeholders for your images
- **Interactive Elements**: Navigation, buttons, and gallery interactions
- **Easy Customization**: Simple to modify colors, fonts, and content

## File Structure

```
temple-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

1. **Open the website**: Double-click `index.html` or open it in VS Code and use Live Server
2. **Add your images**: Replace the placeholder areas with your actual images
3. **Customize content**: Edit the text in `index.html` to match your temple's information
4. **Modify styling**: Update colors, fonts, and layout in `styles.css`

## Adding Images

### Method 1: Direct Image Replacement
1. Create an `images` folder in your project directory
2. Add your images to the `images` folder
3. Update the HTML to reference your images:
   ```html
   <img src="images/your-image.jpg" alt="Description">
   ```

### Method 2: Using JavaScript (Recommended)
1. Add your images to an `images` folder
2. Uncomment and modify the example code in `script.js`:
   ```javascript
   addImageToPlaceholder('.hero-image-placeholder', 'images/hero-image.jpg', 'Main Temple Image');
   ```

## Customization

### Colors
The main colors used are:
- Primary Orange: `#ff6b35`
- Dark Blue: `#2c3e50`
- Light Gray: `#f8f9fa`

### Fonts
The website uses Google Fonts (Poppins). You can change this in the HTML head section.

### Layout
All styling is in `styles.css`. Key sections:
- `.header` - Top orange bar
- `.navbar` - Navigation bar
- `.hero` - Main image section
- `.gallery` - Image gallery

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Next Steps

1. Add your temple's actual images
2. Update the temple name and information
3. Add more content sections as needed
4. Consider adding a contact form
5. Add more interactive features

## Support

This is a template created for easy customization. All code is well-commented for easy understanding and modification.
