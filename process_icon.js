const Jimp = require('jimp');
const path = require('path');

async function processImage() {
    const inputPath = process.argv[2];
    const outputPath = process.argv[3];

    try {
        const image = await Jimp.read(inputPath);

        // Target white background
        const targetColor = { r: 255, g: 255, b: 255, a: 255 };
        const threshold = 10; // Tolerance for "white"

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            if (Math.abs(r - targetColor.r) < threshold &&
                Math.abs(g - targetColor.g) < threshold &&
                Math.abs(b - targetColor.b) < threshold) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
            }
        });

        // Autocrop to remove transparent edges
        image.autocrop();

        await image.writeAsync(outputPath);
        console.log(`Success: Image processed and saved to ${outputPath}`);
    } catch (err) {
        console.error('Error processing image:', err);
        process.exit(1);
    }
}

processImage();
