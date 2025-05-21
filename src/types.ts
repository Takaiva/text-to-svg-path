/**
 * Available output formats for the text-to-svg-path function
 */
export type OutputFormat = 'svg' | 'pathData' | 'pathElement' | 'svgWithBackground';

/**
 * Options for generating SVG path from text
 */
export interface TextToSvgPathOptions {
  /**
   * The text to convert to SVG path
   */
  text: string;
  
  /**
   * URL to the font file (.ttf or .otf)
   */
  fontUrl: string;
  
  /**
   * Font size in pixels
   * @default 72
   */
  fontSize?: number;
  
  /**
   * Fill color for the text
   * @default '#000000'
   */
  fill?: string;
  
  /**
   * Stroke color for the text
   * @default 'none'
   */
  stroke?: string;
  
  /**
   * Stroke width for the text
   * @default '0'
   */
  strokeWidth?: string;
  
  /**
   * Whether to use kerning
   * @default true
   */
  kerning?: boolean;
  
  /**
   * X position of the text
   * @default 0
   */
  x?: number;
  
  /**
   * Y position of the text
   * @default fontSize
   */
  y?: number;
  
  /**
   * SVG width (auto calculated if not provided)
   */
  width?: number;
  
  /**
   * SVG height (auto calculated if not provided)
   */
  height?: number;
  
  /**
   * Background color in hex format (e.g. '#333333').
   * If provided, an additional SVG with this background color will be generated.
   */
  background?: string;
  
  /**
   * Width of the background rectangle for SVG with background
   * @default 400
   */
  backgroundWidth?: number;
  
  /**
   * Height of the background rectangle for SVG with background
   * @default 200
   */
  backgroundHeight?: number;
  
  /**
   * X position of text within the background SVG
   * @default 50
   */
  backgroundX?: number;
  
  /**
   * Y position of text within the background SVG
   * @default 120
   */
  backgroundY?: number;
  
  /**
   * Specifies which output formats to generate.
   * If omitted, all formats will be generated.
   * @example ['pathData', 'pathElement'] - Generate only path data and path element
   */
  outputFormats?: OutputFormat[];
}

/**
 * Response from the text-to-svg-path function
 */
export interface TextToSvgPathResult {
  /**
   * The SVG as a string
   */
  svg: string;
  
  /**
   * SVG with background (only if background color is provided)
   */
  svgWithBackground?: string;
  
  /**
   * The raw SVG path data (d attribute)
   */
  pathData: string;

  /**
   * Complete path element with attributes as a string (for custom use in SVG)
   */
  pathElement: string;
}

/**
 * Multi-text options where keys are text identifiers and values are TextToSvgPathOptions
 */
export type MultiTextToSvgPathOptions<T extends Record<string, any>> = {
  [K in keyof T]: TextToSvgPathOptions;
};

/**
 * Multi-text result where keys match the input options and values are TextToSvgPathResult
 */
export type MultiTextToSvgPathResult<T extends Record<string, any>> = {
  [K in keyof T]: TextToSvgPathResult;
}; 