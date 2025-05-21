import * as opentype from 'opentype.js';
import fetch from 'node-fetch';
import { 
  TextToSvgPathOptions, 
  TextToSvgPathResult, 
  MultiTextToSvgPathOptions, 
  MultiTextToSvgPathResult,
  OutputFormat 
} from './types';

/**
 * Convert text to SVG path using any font URL
 * @param options Options for generating the SVG
 * @returns Promise resolving to the SVG string
 */
export async function textToSvgPath(options: TextToSvgPathOptions): Promise<TextToSvgPathResult>;
export async function textToSvgPath<T extends Record<string, any>>(options: MultiTextToSvgPathOptions<T>): Promise<MultiTextToSvgPathResult<T>>;
export async function textToSvgPath<T extends Record<string, any>>(
  options: TextToSvgPathOptions | MultiTextToSvgPathOptions<T>
): Promise<TextToSvgPathResult | MultiTextToSvgPathResult<T>> {
  // Single text case
  if ('text' in options && 'fontUrl' in options) {
    return processSingleText(options as TextToSvgPathOptions);
  }
  
  // Multi-text case
  const multiOptions = options as MultiTextToSvgPathOptions<T>;
  const keys = Object.keys(multiOptions) as Array<keyof T>;
  
  // Process all text options and combine results
  const result = {} as MultiTextToSvgPathResult<T>;
  
  // Group by fontUrl to avoid redundant font fetching
  const fontGroups: Record<string, Array<keyof T>> = {};
  
  // Group text options by font URL
  for (const key of keys) {
    const opts = multiOptions[key];
    if (!fontGroups[opts.fontUrl]) {
      fontGroups[opts.fontUrl] = [];
    }
    fontGroups[opts.fontUrl].push(key);
  }
  
  // Process each font group
  for (const fontUrl of Object.keys(fontGroups)) {
    try {
      // Fetch the font only once per unique URL
      console.log(`Fetching font from ${fontUrl}...`);
      const fontResponse = await fetch(fontUrl);
      
      if (!fontResponse.ok) {
        throw new Error(`Failed to fetch font: ${fontResponse.statusText} (${fontResponse.status})`);
      }
      
      // Get the font as an ArrayBuffer
      const fontData = await fontResponse.arrayBuffer();
      
      // Parse the font using opentype.js
      const font = opentype.parse(fontData);
      
      // Process each text option that uses this font
      for (const key of fontGroups[fontUrl]) {
        const opts = multiOptions[key];
        
        // Generate the SVG for this text option using the already loaded font
        result[key] = await processTextWithFont(opts, font);
      }
    } catch (error: any) {
      // If there's an error with a font, add error to all results using that font
      for (const key of fontGroups[fontUrl]) {
        result[key] = {
          svg: `<svg><text>Error: ${error.message}</text></svg>`,
          pathData: '',
          pathElement: ''
        };
      }
    }
  }
  
  return result;
}

/**
 * Process a single text option (original implementation)
 */
async function processSingleText(options: TextToSvgPathOptions): Promise<TextToSvgPathResult> {
  const {
    text,
    fontUrl,
    fontSize = 72,
    fill = '#000000',
    stroke = 'none',
    strokeWidth = '0',
    kerning = true,
    x = 0,
    y = fontSize, // Default y position at fontSize for proper alignment
    background
  } = options;

  // Result to return
  const result: TextToSvgPathResult = {
    svg: '',
    pathData: '',
    pathElement: ''
  };

  try {
    // Fetch the font file directly from URL
    console.log(`Fetching font from ${fontUrl}...`);
    const fontResponse = await fetch(fontUrl);
    
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.statusText} (${fontResponse.status})`);
    }
    
    // Get the font as an ArrayBuffer
    const fontData = await fontResponse.arrayBuffer();
    
    // Parse the font using opentype.js
    const font = opentype.parse(fontData);
    
    return processTextWithFont(options, font);
  } catch (error: any) {
    // Improve error message
    const errorMessage = error.message || 'Unknown error';
    throw new Error(`Error generating SVG path: ${errorMessage}`);
  }
}

/**
 * Process text with a preloaded font
 */
async function processTextWithFont(options: TextToSvgPathOptions, font: opentype.Font): Promise<TextToSvgPathResult> {
  const {
    text,
    fontSize = 72,
    fill = '#000000',
    stroke = 'none',
    strokeWidth = '0',
    kerning = true,
    x = 0,
    y = fontSize,
    background,
    backgroundWidth = 400,
    backgroundHeight = 200,
    backgroundX = 50,
    backgroundY = 120,
    outputFormats
  } = options;

  // Determine which formats to generate
  const shouldGenerate = (format: OutputFormat): boolean => {
    if (!outputFormats || outputFormats.length === 0) {
      return true; // Generate all formats by default
    }
    return outputFormats.includes(format);
  };

  // Result to return - initialize with empty strings
  const result: TextToSvgPathResult = {
    svg: '',
    pathData: '',
    pathElement: ''
  };
  
  // Generate path data (always needed as base for other formats)
  const path = font.getPath(text, x, y, fontSize, { kerning });
  result.pathData = path.toPathData(2);
  
  // Generate the path element with attributes if needed
  if (shouldGenerate('pathElement')) {
    result.pathElement = `<path 
  d="${result.pathData}" 
  fill="${fill}"
  stroke="${stroke}"
  stroke-width="${strokeWidth}"
/>`;
  }
  
  // Get the bounding box (needed for SVG)
  if (shouldGenerate('svg')) {
    // Get the bounding box for proper SVG dimensions
    const bbox = path.getBoundingBox();
    
    // Calculate dimensions with padding
    const padding = fontSize * 0.2;
    const width = options.width || Math.ceil(bbox.x2 - bbox.x1 + padding * 2);
    const height = options.height || Math.ceil(bbox.y2 - bbox.y1 + padding * 2);

    // Create the SVG
    result.svg = `<svg 
xmlns="http://www.w3.org/2000/svg" 
width="${width}" 
height="${height}" 
viewBox="${bbox.x1 - padding} ${bbox.y1 - padding} ${width} ${height}"
>
${result.pathElement || `<path 
  d="${result.pathData}" 
  fill="${fill}"
  stroke="${stroke}"
  stroke-width="${strokeWidth}"
/>`}
</svg>`;
  }
  
  // Generate SVG with background ONLY if requested AND background color is provided
  if (shouldGenerate('svgWithBackground') && background) {
    result.svgWithBackground = `<svg 
xmlns="http://www.w3.org/2000/svg" 
width="${backgroundWidth}" 
height="${backgroundHeight}" 
viewBox="0 0 ${backgroundWidth} ${backgroundHeight}"
>
<rect x="0" y="0" width="${backgroundWidth}" height="${backgroundHeight}" fill="${background}" />
<path 
  d="${result.pathData}" 
  transform="translate(${backgroundX}, ${backgroundY})" 
  fill="${fill}"
  stroke="${stroke}"
  stroke-width="${strokeWidth}"
/>
</svg>`;
  }
  
  return result;
} 