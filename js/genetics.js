// Constants
var FXS = {
    1: fx1,
    2: fx2,
    3: fx3,
    4: fx4,
    5: fx5
}

// Random generator
var chance = new Chance(Math.random);
var numbits;

class Chromosome {
    constructor(integer, size = 8) {
        this.value = integer;
        this.string = Chromosome.intToChrom(integer, size);
        this.fx = null;
        this.valid = true;
    }

    crossover(other) {
        var index = chance.integer({ min: 1, max: this.string.length - 2 });
        var size = this.string.length;

        // console.log('Mixing', this.value, this.string, 'with',
        //     other.value, other.string, 'with crossover point', index);

        // Crossover the chromosomes using bitwise operators.
        var lmask = -1 << index;
        var rmask = 0;
        for (var i = 0; i < index; ++i) {
            rmask += 2 ** i;
        }

        var result = (this.value & lmask) | (other.value & rmask);

        // console.log('Masks:', lmask, Chromosome.intToChrom(lmask, numbits), rmask, Chromosome.intToChrom(rmask, numbits));
        // console.log('Result:', result, Chromosome.intToChrom(result, numbits));

        return new Chromosome(result, numbits)
    }

    mutate() {
        var index = chance.integer({ min: 0, max: this.string.length - 1 });
        var mask = 2 ** index;

        console.log('Mutating at index', index, this.value, this.string);

        this.value ^= mask;
        this.string = Chromosome.intToChrom(this.value, numbits);

        console.log('Mutation:', this.value, this.string);

    }

    /*
     * Utility function for the constructor. Converts an integer
     * to a bit array with the most significant bit is at index 0.
     */
    static intToChrom(integer, chsize) {
        var bitarray = new Array(chsize);
        var index = chsize - 1;

        while (index >= 0) {
            bitarray[index] = integer & 1;
            integer = integer >> 1;
            --index;
        }
        return bitarray;
    }

    /*
     * Initializes the fixed size for all chromosomes so they can reproduce
     * uniformly with other chromosomes within the same function.
     */
    static bitsRequired(left, right) {
        var maximum = Math.max(Math.abs(left), Math.abs(right));

        // Significant bit is added to form a signed integer.
        return Math.ceil(Math.log2(maximum)) + 1;
    }
}

function genetic_search(fx, maxmin, nchrom, ngen, llim, rlim) {
    console.log('Starting genetic algorithm...');
    var objective = (maxmin ? 'maximum' : 'minimum');
    console.log('Searching for', objective, 'within range [', llim, ',', rlim, ']');
    console.log('Chromosomes per generation:', nchrom);
    console.log('Generations:', ngen);

    // Prepares the fixed size of all chromosomes
    numbits = Chromosome.bitsRequired(llim, rlim);
    var keyfunc = (maxmin ? maxsort : minsort);
    var gen = [];

    // Plot lists
    var genX = [];
    var genY = [];
    var tempX;
    var tempY;

    // Genetic search
    for (var i = 0; i < ngen; ++i) {
        tempX = [];
        tempY = [];

        // Plots of this generation of a different color
        console.log("Generation:", i + 1, ". Initial population:", gen.length);

        // Populate this generation
        if (gen.length < nchrom) {
            console.log("\tPopulating with", nchrom - gen.length, "more chromosomes.");

            new_gen = populate(nchrom - gen.length, numbits, llim, rlim);

            // Add new generation to current population
            for (ng of new_gen) {
                gen.push(ng);
            }
        }

        // Evaluate the current population
        var toRemove = [];
        for (var j = 0; j < gen.length; ++j) {
            // console.log("\t", gen[j].value, gen[j].string);

            if (gen[j].value < llim || gen[j].value > rlim) {
                toRemove.splice(0, 0, j);
            }

            else {
                var val = gen[j].value;
                var result = FXS[fx](val)
                gen[j].fx = result;

                tempX.push(val);
                tempY.push(result);
            }
        }

        genX.push(tempX);
        genY.push(tempY);

        // Kill those who are out of bounds (if any).
        var removed;
        for (tr of toRemove) {
            removed = gen.splice(tr, 1);
            console.log("\tRemoving", removed.value, removed.string);
        }


        // Make sure that the most fit reproduce with another most fit
        // by ordering the population according to the fitness function.
        gen.sort(keyfunc);

        // Mutate the offspring randomly
        var len = Math.ceil(gen.length / 2);
        if (len % 2 == 1) {
            // gen[len - 1].mutate();
        }

        // Kill those who are unfit
        gen.splice(len);

        // Crossover the current generation
        for (var j = 0; j < (len / 2) && gen.length < nchrom; ++j) {
            // console.log("Crossover", j, gen[j * 2].value, "with", gen[j * 2 + 1]);

            child = gen[j * 2].crossover(gen[j * 2 + 1]);
            gen.push(child);
        }
    }

    var genAuxX= [genX[genX.length - 3], genX[genX.length - 2], genX[genX.length - 1]];
    var genAuxY= [genY[genY.length - 3], genY[genY.length - 2], genY[genY.length - 1]];

    plot_fx(genAuxX, genAuxY);
}

/*
 * Returns a list a chromosomes.
 */
function populate(amount, chsize, llim, rlim) {
    var randInt;
    var result = [];

    for (var i = 0; i < amount; ++i) {
        randInt = chance.integer({ min: llim, max: rlim });

        result.push(new Chromosome(randInt, chsize));
    }
    return result;
}

/*
 * Comparing functions for sortting methods.
 */
function maxsort(ch1, ch2) {
    if (ch1.fx > ch2.fx) {
        return -1;
    }
    if (ch1.fx < ch2.fx) {
        return 1;
    }
    return 0;
}

function minsort(ch1, ch2) {
    if (ch1.fx < ch2.fx) {
        return -1;
    }
    if (ch1.fx > ch2.fx) {
        return 1;
    }

    return 0;
}
