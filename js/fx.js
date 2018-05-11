function fx1(x) {
    return x ** 2;
}

function fx2(x) {
    return 40 * Math.sin(x * (Math.PI / 180));
}

function fx3(x) {
    return Math.cos(x * (Math.PI / 180)) + x;
}

function fx4(x) {
    return (1000 / Math.abs(50 - x)) + x
}

function fx5(x) {
    return (1000 / Math.abs(30 - x)) +
        (1000 / Math.abs(50 - x)) +
        (1000 / Math.abs(80 - x)) + x;
}



function plot_fx(xs, ys) {
    // Initial plot
    var data = []
    var generations = xs.length;

    if (generations > 0) {
        var rainbow = new Rainbow();
        rainbow.setNumberRange(1, generations);
        rainbow.setSpectrum("blue", "red");
    }

    var data = [];
    var temp;
    for (var i = 0; i < generations; ++i) {
        temp = {
            x: xs[i],
            y: ys[i],
            mode: 'markers',
            type: 'scatter',
            name: 'Generation #' + (i + 1),
            marker: {
                color: '#' + rainbow.colourAt(i)
            }
        }
        data.push(temp);
    }

    Plotly.newPlot('plotdiv', data);
}

function hsl2rgb(r, g, b) {

}