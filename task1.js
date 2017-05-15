let args = process.argv.slice(2); // only command line arguments

let result = args.reduce((prev, current) => {
    if (parseFloat(current)) // skip NaN
        return prev + parseFloat(current);
    return prev;
}, 0) // avoid validate "prev"" value

process.stdout.write(result.toString());