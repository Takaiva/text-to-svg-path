/**
 * Example usage of the text-to-svg-path module
 * 
 * To run this example:
 * npm run test
 */

import { textToSvgPath } from './text-to-svg-path';

// URL to a font file
// This uses the Google Fonts GitHub repository to get a direct TTF file
const FONT_URL = 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf';
const CHAKRA_PETCH_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/chakrapetch/ChakraPetch-Regular.ttf';

async function runExample() {
  try {
    console.log('Example 1: Basic SVG with Roboto font');
    const svgResult = await textToSvgPath({
      text: 'Hello World',
      fontUrl: FONT_URL,
      fontSize: 72,
      fill: '#3366CC'
    });
    
    console.log('\nGenerated SVG:');
    console.log(svgResult.svg);
    
    console.log('\nResult object structure (without SVG content):');
    console.log(JSON.stringify({
      hasPathData: !!svgResult.pathData,
      hasPathElement: !!svgResult.pathElement,
      hasSvg: !!svgResult.svg,
      hasSvgWithBackground: !!svgResult.svgWithBackground,
      keys: Object.keys(svgResult)
    }, null, 2));
    
    console.log('\n\nExample 2: "takaiva" with Chakra Petch font and white text on custom background');
    const takaivaResult = await textToSvgPath({
      text: 'takaiva',
      fontUrl: CHAKRA_PETCH_URL,
      fontSize: 60,
      fill: '#FFFFFF',
      background: '#333333'
    });
    
    console.log('\nGenerated SVG with background:');
    console.log(takaivaResult.svgWithBackground);
    
    console.log('\nResult object structure (without SVG content):');
    console.log(JSON.stringify({
      hasPathData: !!takaivaResult.pathData,
      hasPathElement: !!takaivaResult.pathElement,
      hasSvg: !!takaivaResult.svg,
      hasSvgWithBackground: !!takaivaResult.svgWithBackground,
      keys: Object.keys(takaivaResult)
    }, null, 2));
    
    console.log('\n\nPath data only (for custom use):');
    console.log(takaivaResult.pathData);
    
    console.log('\n\nPath element with attributes:');
    console.log(takaivaResult.pathElement);
    
    // Example 3: Multi-text functionality
    console.log('\n\nExample 3: Multi-text functionality with different fonts and styles');
    const multiTextResult = await textToSvgPath({
      mainText: {
        text: 'Main Title',
        fontUrl: FONT_URL,
        fontSize: 80,
        fill: '#2C3E50'
      },
      secondaryText: {
        text: 'Subtitle text',
        fontUrl: FONT_URL,
        fontSize: 40,
        fill: '#7F8C8D'
      },
      logo: {
        text: 'LOGO',
        fontUrl: CHAKRA_PETCH_URL,
        fontSize: 60,
        fill: '#E74C3C',
        background: '#333333'
      }
    });
    
    console.log('\nMain Title SVG:');
    console.log(multiTextResult.mainText.svg);
    
    console.log('\nSubtitle SVG:');
    console.log(multiTextResult.secondaryText.svg);
    
    console.log('\nLogo SVG with background:');
    console.log(multiTextResult.logo.svgWithBackground);
    
    console.log('\nLogo path element:');
    console.log(multiTextResult.logo.pathElement);
    
    // Example with different background colors
    console.log('\n\nExample 4: Text with different background colors');
    const colorBackgrounds = await textToSvgPath({
      blueBackground: {
        text: 'Blue',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#FFFFFF',
        background: '#0066CC'
      },
      redBackground: {
        text: 'Red',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#FFFFFF',
        background: '#CC0000'
      },
      greenBackground: {
        text: 'Green',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#FFFFFF',
        background: '#008800'
      }
    });
    
    console.log('\nBlue background SVG:');
    console.log(colorBackgrounds.blueBackground.svgWithBackground);
    
    console.log('\nRed background SVG:');
    console.log(colorBackgrounds.redBackground.svgWithBackground);
    
    console.log('\nGreen background SVG:');
    console.log(colorBackgrounds.greenBackground.svgWithBackground);
    
    // Example 5: Using outputFormats option to selectively generate output formats
    console.log('\n\nExample 5: Using outputFormats to optimize performance');
    
    console.log('\nGenerating only pathData and pathElement:');
    const pathOnlyResult = await textToSvgPath({
      text: 'Path Only',
      fontUrl: FONT_URL,
      fontSize: 60,
      fill: '#000000',
      outputFormats: ['pathData', 'pathElement']
    });
    
    console.log(JSON.stringify({
      hasPathData: !!pathOnlyResult.pathData,
      hasPathElement: !!pathOnlyResult.pathElement,
      hasSvg: !!pathOnlyResult.svg,
      hasSvgWithBackground: !!pathOnlyResult.svgWithBackground,
      keys: Object.keys(pathOnlyResult)
    }, null, 2));
    
    console.log('\nGenerating only SVG with background:');
    const backgroundOnlyResult = await textToSvgPath({
      text: 'Background Only',
      fontUrl: FONT_URL,
      fontSize: 60,
      fill: '#FFFFFF',
      background: '#000000',
      outputFormats: ['svgWithBackground']
    });
    
    console.log(JSON.stringify({
      hasPathData: !!backgroundOnlyResult.pathData,
      hasPathElement: !!backgroundOnlyResult.pathElement,
      hasSvg: !!backgroundOnlyResult.svg,
      hasSvgWithBackground: !!backgroundOnlyResult.svgWithBackground,
      keys: Object.keys(backgroundOnlyResult)
    }, null, 2));
    
    // Example 6: Multi-text with different outputFormats for each text
    console.log('\n\nExample 6: Multi-text with selective output formats');
    const mixedOutputFormatsResult = await textToSvgPath({
      svgOnly: {
        text: 'SVG Only',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#333333',
        outputFormats: ['svg']
      },
      pathsOnly: {
        text: 'Paths Only',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#333333',
        outputFormats: ['pathData', 'pathElement']
      },
      withBackground: {
        text: 'With Background',
        fontUrl: FONT_URL,
        fontSize: 60,
        fill: '#FFFFFF',
        background: '#663399',
        outputFormats: ['svgWithBackground']
      }
    });
    
    console.log('\nSVG Only result:');
    console.log(JSON.stringify({
      hasPathData: !!mixedOutputFormatsResult.svgOnly.pathData,
      hasPathElement: !!mixedOutputFormatsResult.svgOnly.pathElement,
      hasSvg: !!mixedOutputFormatsResult.svgOnly.svg,
      hasSvgWithBackground: !!mixedOutputFormatsResult.svgOnly.svgWithBackground,
      keys: Object.keys(mixedOutputFormatsResult.svgOnly)
    }, null, 2));
    
    console.log('\nPaths Only result:');
    console.log(JSON.stringify({
      hasPathData: !!mixedOutputFormatsResult.pathsOnly.pathData,
      hasPathElement: !!mixedOutputFormatsResult.pathsOnly.pathElement,
      hasSvg: !!mixedOutputFormatsResult.pathsOnly.svg,
      hasSvgWithBackground: !!mixedOutputFormatsResult.pathsOnly.svgWithBackground,
      keys: Object.keys(mixedOutputFormatsResult.pathsOnly)
    }, null, 2));
    
    console.log('\nWith Background result:');
    console.log(JSON.stringify({
      hasPathData: !!mixedOutputFormatsResult.withBackground.pathData,
      hasPathElement: !!mixedOutputFormatsResult.withBackground.pathElement,
      hasSvg: !!mixedOutputFormatsResult.withBackground.svg,
      hasSvgWithBackground: !!mixedOutputFormatsResult.withBackground.svgWithBackground,
      keys: Object.keys(mixedOutputFormatsResult.withBackground)
    }, null, 2));
    
    // Example of custom SVG combining multiple path elements
    const customSvg = `<svg 
xmlns="http://www.w3.org/2000/svg" 
width="800" 
height="400" 
viewBox="0 0 800 400">
  <rect x="0" y="0" width="800" height="400" fill="#f5f5f5" />
  <g transform="translate(50, 100)">
    ${multiTextResult.mainText.pathElement}
  </g>
  <g transform="translate(100, 200)">
    ${multiTextResult.secondaryText.pathElement}
  </g>
  <g transform="translate(400, 150)">
    ${multiTextResult.logo.pathElement}
  </g>
</svg>`;
    
    console.log('\n\nCustom SVG combining multiple path elements:');
    console.log(customSvg.substring(0, 150) + '...');
    
    // Example of using the SVG in HTML
    const htmlExample = `
<!DOCTYPE html>
<html>
<head>
  <title>Text to SVG Path Example</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .svg-container { margin: 20px 0; background: #f5f5f5; padding: 20px; border-radius: 5px; }
    .dark-bg { background: #333; }
  </style>
</head>
<body>
  <h1>Text to SVG Path Examples</h1>
  
  <h2>Basic Example:</h2>
  <div class="svg-container">
    ${svgResult.svg}
  </div>
  
  <h2>Text with Background:</h2>
  <div class="svg-container">
    ${takaivaResult.svgWithBackground}
  </div>
  
  <h2>Multi-Text Example:</h2>
  <div class="svg-container">
    ${multiTextResult.mainText.svg}
    ${multiTextResult.secondaryText.svg}
  </div>
  
  <div class="svg-container">
    ${multiTextResult.logo.svgWithBackground}
  </div>
  
  <h2>Custom Combined SVG:</h2>
  <div class="svg-container">
    ${customSvg}
  </div>
  
  <h2>Different Background Colors:</h2>
  <div class="svg-container">
    ${colorBackgrounds.blueBackground.svgWithBackground}
    ${colorBackgrounds.redBackground.svgWithBackground}
    ${colorBackgrounds.greenBackground.svgWithBackground}
  </div>
</body>
</html>`;
    
    console.log('\n\nExample HTML:');
    console.log(htmlExample.substring(0, 150) + '...');
    
    // Example 7: Customizing background dimensions and text positioning
    console.log('\n\nExample 7: Customizing background dimensions and text positioning');
    const customBackgroundResult = await textToSvgPath({
      text: 'Custom Layout',
      fontUrl: FONT_URL,
      fontSize: 60,
      fill: '#FFFFFF',
      background: '#000066',
      backgroundWidth: 600,    // Wider background
      backgroundHeight: 300,   // Taller background
      backgroundX: 150,        // Position text horizontally centered
      backgroundY: 170         // Position text vertically centered
    });

    console.log('\nCustom background layout SVG:');
    console.log(customBackgroundResult.svgWithBackground);

    // Example with different text placements within the same background size
    console.log('\n\nExample 8: Different text placements within backgrounds');
    const placementsResult = await textToSvgPath({
      topLeft: {
        text: 'Top Left',
        fontUrl: FONT_URL,
        fontSize: 30,
        fill: '#FFFFFF',
        background: '#333333',
        backgroundX: 20,
        backgroundY: 40
      },
      center: {
        text: 'Center',
        fontUrl: FONT_URL,
        fontSize: 30,
        fill: '#FFFFFF',
        background: '#333333',
        backgroundX: 150,
        backgroundY: 110
      },
      bottomRight: {
        text: 'Bottom Right',
        fontUrl: FONT_URL,
        fontSize: 30,
        fill: '#FFFFFF',
        background: '#333333',
        backgroundX: 240,
        backgroundY: 180
      }
    });

    console.log('\nTop Left placement:');
    console.log(placementsResult.topLeft.svgWithBackground);

    console.log('\nCenter placement:');
    console.log(placementsResult.center.svgWithBackground);

    console.log('\nBottom Right placement:');
    console.log(placementsResult.bottomRight.svgWithBackground);
    
  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Run the example
runExample(); 