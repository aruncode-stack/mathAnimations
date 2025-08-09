// Global variables
let currentSlope = 1;
let currentIntercept = 5;
let plotlyInitialized = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Plotly to load
    setTimeout(initializeApp, 100);
});

function initializeApp() {
    // Get slider elements
    const slopeSlider = document.getElementById('slope-slider');
    const interceptSlider = document.getElementById('intercept-slider');
    
    // Get value display elements
    const slopeValue = document.getElementById('slope-value');
    const interceptValue = document.getElementById('intercept-value');
    
    // Add event listeners for sliders
    slopeSlider.addEventListener('input', function() {
        currentSlope = parseFloat(this.value);
        updateDisplay();
    });
    
    interceptSlider.addEventListener('input', function() {
        currentIntercept = parseFloat(this.value);
        updateDisplay();
    });
    
    // Add event listeners for example buttons
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const slope = parseFloat(this.dataset.slope);
            const intercept = parseFloat(this.dataset.intercept);
            setEquation(slope, intercept);
        });
    });
    
    // Initialize the graph and display
    updateDisplay();
}

function updateDisplay() {
    updateEquationText();
    updateValueDisplays();
    updateGraph();
}

function updateEquationText() {
    const equationElement = document.getElementById('equation-text');
    
    // Format the equation nicely
    let equationText;
    if (currentSlope === 0) {
        equationText = `y = ${formatNumber(currentIntercept)}`;
    } else if (currentSlope === 1) {
        if (currentIntercept === 0) {
            equationText = `y = x`;
        } else if (currentIntercept > 0) {
            equationText = `y = x + ${formatNumber(currentIntercept)}`;
        } else {
            equationText = `y = x - ${formatNumber(Math.abs(currentIntercept))}`;
        }
    } else if (currentSlope === -1) {
        if (currentIntercept === 0) {
            equationText = `y = -x`;
        } else if (currentIntercept > 0) {
            equationText = `y = -x + ${formatNumber(currentIntercept)}`;
        } else {
            equationText = `y = -x - ${formatNumber(Math.abs(currentIntercept))}`;
        }
    } else {
        if (currentIntercept === 0) {
            equationText = `y = ${formatNumber(currentSlope)}x`;
        } else if (currentIntercept > 0) {
            equationText = `y = ${formatNumber(currentSlope)}x + ${formatNumber(currentIntercept)}`;
        } else {
            equationText = `y = ${formatNumber(currentSlope)}x - ${formatNumber(Math.abs(currentIntercept))}`;
        }
    }
    
    equationElement.textContent = equationText;
}

function updateValueDisplays() {
    document.getElementById('slope-display').textContent = formatNumber(currentSlope);
    document.getElementById('intercept-display').textContent = formatNumber(currentIntercept);
    
    // Update tan display
    const angleRadians = Math.atan(currentSlope);
    const angleDegrees = angleRadians * (180 / Math.PI);
    document.getElementById('slope-tan-display').textContent = `= tan(${angleDegrees.toFixed(1)}°)`;
}

function updateGraph() {
    // Check if Plotly is available
    if (typeof Plotly === 'undefined') {
        console.error('Plotly is not loaded. Check your internet connection.');
        document.getElementById('graph').innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Graph loading failed. Please check your internet connection and refresh the page.</p>';
        return;
    }
    
    const graphDiv = document.getElementById('graph');
    
    // Generate x values
    const xValues = [];
    const yValues = [];
    
    for (let x = -15; x <= 15; x += 0.5) {
        xValues.push(x);
        yValues.push(currentSlope * x + currentIntercept);
    }
    
    // Create the line trace
    const lineTrace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'y = mx + b',
        line: {
            color: '#3498db',
            width: 4
        }
    };
    
    // Highlight y-intercept point
    const interceptTrace = {
        x: [0],
        y: [currentIntercept],
        type: 'scatter',
        mode: 'markers',
        name: 'Y-intercept',
        marker: {
            color: '#e74c3c',
            size: 12,
            line: {
                color: 'white',
                width: 2
            }
        }
    };
    
    // Y-intercept line from origin to y-intercept point
    const interceptLineTrace = {
        x: [0, 0],
        y: [0, currentIntercept],
        type: 'scatter',
        mode: 'lines',
        name: 'Y-intercept distance',
        line: {
            color: '#e74c3c',
            width: 3,
            dash: 'dot'
        },
        showlegend: false
    };
    
    // Calculate x-intercept: where y = 0, so 0 = mx + b, therefore x = -b/m
    const xIntercept = currentSlope !== 0 ? -currentIntercept / currentSlope : 0;
    
    // Create angle arc visualization
    const createAngleArc = (centerX, centerY, radius, startAngle, endAngle) => {
        const points = 30; // Number of points for smooth arc
        const x = [];
        const y = [];
        
        // Add center point first for filling
        x.push(centerX);
        y.push(centerY);
        
        // Create arc points
        for (let i = 0; i <= points; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / points);
            x.push(centerX + radius * Math.cos(angle));
            y.push(centerY + radius * Math.sin(angle));
        }
        
        // Close the arc back to center
        x.push(centerX);
        y.push(centerY);
        
        return { x, y };
    };
    
    // Slope visualization - angle arc at x-intercept
    let angleRadians = Math.atan(currentSlope);
    
    // For negative slopes, measure counter-clockwise from positive x-axis
    if (currentSlope < 0) {
        angleRadians = Math.PI + angleRadians; // Add 180° to make it positive counter-clockwise
    }
    
    const arcRadius = 1.5;
    const arcData = createAngleArc(xIntercept, 0, arcRadius, 0, angleRadians);
    
    const angleArcTrace = {
        x: arcData.x,
        y: arcData.y,
        type: 'scatter',
        mode: 'lines',
        name: 'Angle arc',
        line: {
            color: '#f39c12',
            width: 2
        },
        fill: 'toself',
        fillcolor: 'rgba(243, 156, 18, 0.2)',
        showlegend: false
    };
    
    // Arrow annotations for the y-intercept line and slope
    const annotations = [];
    
    if (currentIntercept !== 0) {
        // Y-intercept value label - position based on slope sign
        const yInterceptX = currentSlope < 0 ? -2.5 : 2.5; // Left for negative slope, right for positive
        
        annotations.push({
            x: yInterceptX,
            y: currentIntercept / 2, // Middle of the line
            text: `b = ${formatNumberOneDecimal(currentIntercept)}`,
            showarrow: false,
            font: {
                color: '#e74c3c',
                size: 16,
                family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderwidth: 0,
            borderpad: 8,
            width: 60,
            height: 25,
            align: 'center',
            valign: 'middle'
        });
        
        // Arrow at the top of the y-intercept line
        annotations.push({
            x: 0,
            y: currentIntercept,
            ax: 0,
            ay: currentIntercept > 0 ? currentIntercept - 0.5 : currentIntercept + 0.5,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#e74c3c',
            showarrow: true
        });
        
        // Arrow at the bottom of the y-intercept line
        annotations.push({
            x: 0,
            y: 0,
            ax: 0,
            ay: currentIntercept > 0 ? 0.5 : -0.5,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#e74c3c',
            showarrow: true
        });
    }
    
    // Slope angle annotation
    if (currentSlope !== 0) {
        // Calculate angle in degrees from slope: angle = arctan(slope)
        // For display, always show positive angle (counter-clockwise from positive x-axis)
        let displayAngle = Math.atan(currentSlope) * (180 / Math.PI);
        if (currentSlope < 0) {
            displayAngle = 180 + displayAngle; // Add 180° for negative slopes
        }
        const angleDegrees = displayAngle;
        
        // Position label below the x-axis - adjust based on slope sign
        const labelX = currentSlope < 0 ? xIntercept - 1 : xIntercept + 2; // Left for negative slope, right for positive
        const labelY = -1.5; // Below the x-axis
        
        annotations.push({
            x: labelX,
            y: labelY,
            text: `θ = ${angleDegrees.toFixed(1)}°`,
            showarrow: false,
            font: {
                color: '#f39c12',
                size: 14,
                family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderwidth: 0,
            borderpad: 6,
            align: 'center',
            valign: 'middle'
        });
    }
    
    const traces = [lineTrace, interceptTrace, interceptLineTrace, angleArcTrace];
    
    const layout = {
        title: {
            text: `Linear Equation: y = ${formatNumber(currentSlope)}x + ${formatNumber(currentIntercept)}`,
            font: { size: 18, color: '#2c3e50' }
        },
        xaxis: {
            title: 'x',
            range: [-15, 15],
            gridcolor: '#ecf0f1',
            zerolinecolor: '#bdc3c7',
            zerolinewidth: 2
        },
        yaxis: {
            title: 'y',
            range: [-15, 15],
            gridcolor: '#ecf0f1',
            zerolinecolor: '#bdc3c7',
            zerolinewidth: 2
        },
        plot_bgcolor: '#f8f9fc',
        paper_bgcolor: 'white',
        margin: { t: 60, r: 40, b: 60, l: 60 },
        showlegend: true,
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255,255,255,0.8)',
            bordercolor: '#bdc3c7',
            borderwidth: 1
        },
        annotations: annotations
    };
    
    const config = {
        responsive: true,
        displayModeBar: false
    };
    
    try {
        if (!plotlyInitialized) {
            Plotly.newPlot(graphDiv, traces, layout, config).then(() => {
                plotlyInitialized = true;
            });
        } else {
            Plotly.react(graphDiv, traces, layout, config);
        }
    } catch (error) {
        console.error('Error creating plot:', error);
        graphDiv.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Graph error. Please refresh the page.</p>';
    }
}

function setEquation(slope, intercept) {
    currentSlope = slope;
    currentIntercept = intercept;
    
    // Update slider positions
    document.getElementById('slope-slider').value = slope;
    document.getElementById('intercept-slider').value = intercept;
    
    // Update display
    updateDisplay();
    
    // Add visual feedback
    const equationSection = document.querySelector('.equation-section');
    equationSection.style.transform = 'scale(1.05)';
    equationSection.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        equationSection.style.transform = 'scale(1)';
    }, 300);
}

function formatNumber(num) {
    // Format numbers to avoid floating point precision issues
    if (Math.abs(num) < 0.01) return '0';
    if (num % 1 === 0) return num.toString();
    return Math.round(num * 10) / 10;
}

function formatNumberOneDecimal(num) {
    // Always format with exactly one decimal place
    return num.toFixed(1);
}



// Add some interactive features
document.addEventListener('keydown', function(event) {
    const step = event.shiftKey ? 0.5 : 0.1;
    
    switch(event.key) {
        case 'ArrowUp':
            if (event.ctrlKey) {
                // Increase intercept
                currentIntercept = Math.min(10, currentIntercept + step);
                document.getElementById('intercept-slider').value = currentIntercept;
                updateDisplay();
            } else {
                // Increase slope
                currentSlope = Math.min(5, currentSlope + step);
                document.getElementById('slope-slider').value = currentSlope;
                updateDisplay();
            }
            event.preventDefault();
            break;
            
        case 'ArrowDown':
            if (event.ctrlKey) {
                // Decrease intercept
                currentIntercept = Math.max(-10, currentIntercept - step);
                document.getElementById('intercept-slider').value = currentIntercept;
                updateDisplay();
            } else {
                // Decrease slope
                currentSlope = Math.max(-5, currentSlope - step);
                document.getElementById('slope-slider').value = currentSlope;
                updateDisplay();
            }
            event.preventDefault();
            break;
            
        case 'r':
        case 'R':
            // Reset to default
            setEquation(1, 0);
            break;
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', function(event) {
    if (event.touches.length === 1) {
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
    }
});

document.addEventListener('touchmove', function(event) {
    if (event.touches.length === 1) {
        const touchY = event.touches[0].clientY;
        const touchX = event.touches[0].clientX;
        const deltaY = touchStartY - touchY;
        const deltaX = touchStartX - touchX;
        
        // Only respond to significant movements
        if (Math.abs(deltaY) > 30 || Math.abs(deltaX) > 30) {
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Vertical swipe - change slope
                if (deltaY > 0) {
                    currentSlope = Math.min(5, currentSlope + 0.2);
                } else {
                    currentSlope = Math.max(-5, currentSlope - 0.2);
                }
                document.getElementById('slope-slider').value = currentSlope;
            } else {
                // Horizontal swipe - change intercept
                if (deltaX > 0) {
                    currentIntercept = Math.max(-10, currentIntercept - 0.5);
                } else {
                    currentIntercept = Math.min(10, currentIntercept + 0.5);
                }
                document.getElementById('intercept-slider').value = currentIntercept;
            }
            
            updateDisplay();
            touchStartY = touchY;
            touchStartX = touchX;
        }
    }
});

// Prevent zooming on double-tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
