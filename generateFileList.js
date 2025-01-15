import { readdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const multimediaDir = join(process.cwd(), 'src/multimedia');
const outputFile = join(multimediaDir, 'files.json');

async function generateFileList() {
    try {
        const files = await readdir(multimediaDir);
        const mediaFiles = files.filter(file => {
            const ext = extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.png' || ext === '.gif' || ext === '.mp4' || ext === '.webm' || ext === '.ogg';
        });
        await writeFile(outputFile, JSON.stringify(mediaFiles, null, 2));
        console.log('Archivo files.json generado correctamente.');
    } catch (err) {
        console.error('Error:', err);
    }
}

generateFileList();

