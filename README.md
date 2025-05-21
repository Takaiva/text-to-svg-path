# text-to-svg-path

A lightweight TypeScript utility to convert text to SVG paths using any font URL. It directly fetches fonts from URLs without saving them locally.

## Features

- **Minimal**: Focused on one task - converting text to SVG paths
- **No Local Storage**: Fetches fonts directly from URLs
- **TypeScript**: Fully typed for improved developer experience
- **Customizable**: Control font size, color, stroke, and more
- **Path Data**: Access both the complete SVG and the raw path data
- **Multi-Text Support**: Generate multiple text paths in a single call
- **Performance Optimized**: Request only the output formats you need
- **Customizable Background**: Control background dimensions and text positioning

## Installation

```bash
npm install @takaivasoft/text-to-svg-path
```

## Usage

### Basic Usage

```typescript
import { textToSvgPath } from 'text-to-svg-path';

// URL to a TTF or OTF font file
const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/chakrapetch/ChakraPetch-Regular.ttf';

// Generate the SVG
const svgResult = await textToSvgPath({
  text: 'Hello World',
  fontUrl: fontUrl,
  fontSize: 72,
  fill: '#3366CC'
});

// Use the SVG string
console.log(svgResult.svg);

// Or access the raw path data
console.log(svgResult.pathData);

// Or get the complete path element with attributes
console.log(svgResult.pathElement);
```

### Generating Text with Custom Background

```typescript
const result = await textToSvgPath({
  text: 'takaiva',
  fontUrl: 'https://raw.githubusercontent.com/google/fonts/main/ofl/chakrapetch/ChakraPetch-Regular.ttf',
  fontSize: 60,
  fill: '#FFFFFF', // White text
  background: '#333333', // Specify background color
  backgroundWidth: 600, // Custom background width
  backgroundHeight: 300, // Custom background height
  backgroundX: 150, // Position text horizontally
  backgroundY: 170 // Position text vertically
});

// Get the SVG with background
console.log(result.svgWithBackground);
```

### Performance Optimization

Only generate the output formats you need:

```typescript
// Only generate path data and path element (no SVG)
const pathsOnly = await textToSvgPath({
  text: 'Paths Only',
  fontUrl: fontUrl,
  fontSize: 60,
  fill: '#333333',
  outputFormats: ['pathData', 'pathElement']
});

// Only generate SVG with background
const backgroundOnly = await textToSvgPath({
  text: 'Background Only',
  fontUrl: fontUrl,
  fontSize: 60,
  fill: '#FFFFFF',
  background: '#000000',
  outputFormats: ['svgWithBackground']
});
```

### Multi-Text Functionality

Generate multiple text paths in a single call:

```typescript
const multiTextResult = await textToSvgPath({
  mainTitle: {
    text: 'Main Title',
    fontUrl: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf',
    fontSize: 80,
    fill: '#2C3E50'
  },
  subtitle: {
    text: 'Subtitle text',
    fontUrl: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf',
    fontSize: 40,
    fill: '#7F8C8D'
  },
  logo: {
    text: 'LOGO',
    fontUrl: 'https://raw.githubusercontent.com/google/fonts/main/ofl/chakrapetch/ChakraPetch-Regular.ttf',
    fontSize: 60,
    fill: '#E74C3C',
    background: '#333333'
  }
});

// Access each result
console.log(multiTextResult.mainTitle.svg);
console.log(multiTextResult.subtitle.svg);
console.log(multiTextResult.logo.svgWithBackground);
```

### Using Path Elements to Create Custom SVG

```typescript
// Custom SVG combining multiple path elements
const customSvg = `<svg 
xmlns="http://www.w3.org/2000/svg" 
width="800" 
height="400" 
viewBox="0 0 800 400">
  <rect x="0" y="0" width="800" height="400" fill="#f5f5f5" />
  <g transform="translate(50, 100)">
    ${multiTextResult.mainTitle.pathElement}
  </g>
  <g transform="translate(100, 200)">
    ${multiTextResult.subtitle.pathElement}
  </g>
  <g transform="translate(400, 150)">
    ${multiTextResult.logo.pathElement}
  </g>
</svg>`;

// Insert into HTML
document.getElementById('custom-svg-container').innerHTML = customSvg;
```

### Using in HTML

```typescript
const svgResult = await textToSvgPath({
  text: 'Logo Text',
  fontUrl: '...',
  fill: '#FFFFFF'
});

// Insert directly into HTML
document.getElementById('logo-container').innerHTML = svgResult.svg;

// Or in React (with appropriate type assertions)
return <div dangerouslySetInnerHTML={{__html: svgResult.svg}} />;
```

## API Reference

### `textToSvgPath(options)`

Main function that converts text to SVG paths. Supports both single text and multi-text options.

#### Single Text Options

```typescript
interface TextToSvgPathOptions {
  // Required
  text: string;       // The text to convert to SVG path
  fontUrl: string;    // URL to the font file (.ttf or .otf)
  
  // Optional with defaults
  fontSize?: number;  // Font size in pixels (default: 72)
  fill?: string;      // Fill color (default: '#000000')
  stroke?: string;    // Stroke color (default: 'none')
  strokeWidth?: string; // Stroke width (default: '0')
  kerning?: boolean;  // Whether to use kerning (default: true)
  x?: number;         // X position (default: 0)
  y?: number;         // Y position (default: fontSize)
  width?: number;     // SVG width (auto calculated if not provided)
  height?: number;    // SVG height (auto calculated if not provided)
  
  // Background options
  background?: string; // Background color in hex format (e.g. '#333333')
  backgroundWidth?: number; // Width of background rectangle (default: 400)
  backgroundHeight?: number; // Height of background rectangle (default: 200)
  backgroundX?: number; // X position of text within background (default: 50)
  backgroundY?: number; // Y position of text within background (default: 120)
  
  // Performance optimization
  outputFormats?: OutputFormat[]; // Formats to generate: 'svg' | 'pathData' | 'pathElement' | 'svgWithBackground'
}
```

#### Multi-Text Options

```typescript
type MultiTextToSvgPathOptions<T extends Record<string, any>> = {
  [K in keyof T]: TextToSvgPathOptions;
};
```

#### Return Value (Single Text)

```typescript
interface TextToSvgPathResult {
  svg: string;        // The complete SVG as a string
  pathData: string;   // The raw SVG path data (d attribute)
  pathElement: string; // Path element with attributes
  svgWithBackground?: string; // SVG with background (if background color is provided)
}
```

#### Return Value (Multi-Text)

```typescript
type MultiTextToSvgPathResult<T extends Record<string, any>> = {
  [K in keyof T]: TextToSvgPathResult;
};
```

## Finding Font URLs

This library works with direct URLs to TTF or OTF font files. Some places to find these:

1. **Google Fonts GitHub Repository**:
   - Format: `https://raw.githubusercontent.com/google/fonts/main/ofl/[fontname]/[FontName-Style].ttf`
   - Example: `https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf`

2. **Other GitHub Repositories**:
   - Many fonts maintain their own repositories with font files

3. **Self-Hosted Fonts**:
   - Any direct URL to a TTF or OTF file will work

## License

MIT 
