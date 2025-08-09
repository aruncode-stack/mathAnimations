# Interactive Linear Equation Animation

An interactive web-based visualization tool for exploring linear equations of the form `y = mx + b`.

## Features

- **Real-time Interactive Controls**: Adjust slope (m) and y-intercept (b) with sliders
- **Dynamic Graph Visualization**: Live updates using Plotly.js with square aspect ratio for accurate slope representation
- **Y-intercept Visualization**: Dotted line from origin to y-intercept with value label
- **Slope Angle Visualization**: Arc showing the angle θ between the line and x-axis
- **Educational Labels**: 
  - Y-intercept value (b = X.X) with smart positioning
  - Angle measurement (θ = X.X°) calculated from slope using tan⁻¹(m)
- **Example Equations**: Quick-select buttons for common linear equations
- **Mobile-Friendly**: Responsive design that works on all devices
- **Mathematical Accuracy**: 
  - Equal axis scaling for true geometric representation
  - Positive angle measurement (counter-clockwise from positive x-axis)
  - Smart label positioning based on slope sign

## Files

- `index.html` - Main webpage structure
- `styles.css` - Responsive styling and layout
- `script.js` - Interactive functionality and graph rendering
- `test.html` - Simple test file for Plotly.js loading

## How to Use

1. Open `index.html` in any modern web browser
2. Use the sliders to adjust:
   - **Slope (m)**: Controls the steepness and direction of the line
   - **Y-intercept (b)**: Controls where the line crosses the y-axis
3. Try the example equations with one-click buttons
4. Observe how the visualizations update in real-time:
   - The linear equation display
   - The graph line position
   - The y-intercept dotted line and label
   - The angle arc and degree measurement

## Educational Value

This tool helps students understand:
- The relationship between slope (m) and angle (θ): `m = tan(θ)`
- How y-intercept affects the vertical position of the line
- Visual representation of rise over run
- The geometric meaning of positive and negative slopes
- Accurate angle measurements in standard mathematical notation

## Technology Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Responsive design and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Plotly.js** - Professional graph visualization
- **Pure web technologies** - No build process required

## Browser Compatibility

Works in all modern browsers including Chrome, Firefox, Safari, and Edge. No plugins or additional software required.

## Inspiration

Inspired by educational math resources like [Math is Fun](https://www.mathsisfun.com/equation_of_line.html).
