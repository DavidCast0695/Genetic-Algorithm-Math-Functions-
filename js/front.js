function calculate() {
    var fx = getRadioValue('fx');
    if (fx == -1) {
        console.log('Missing input function.');
        return;
    }

    var maxmin = getRadioValue('maxmin');
    if (maxmin == -1) {
        console.log('Missing minimum/maximum parameter.');
        return;
    }

    var chrom_num = parseInt(document.getElementById('chromosomes').value);
    if (chrom_num < 2) {
        console.log('There must be at least 2 chromosomes per generation.');
        return;
    }
    var gen_num = parseInt(document.getElementById('generations').value);
    var llim = parseInt(document.getElementById('l_limit').value);
    var rlim = parseInt(document.getElementById('r_limit').value);
    if (llim > rlim) {
        console.log('Left limit must have lower value than right limit.');
        return;
    }

    genetic_search(fx, maxmin, chrom_num, gen_num, llim, rlim);
}


function getRadioValue(name) {
    var radios = document.getElementsByName(name);

    for (r of radios) {
        if (r.checked) {
            return parseInt(r.value);
        }
    }

    return -1;
}
