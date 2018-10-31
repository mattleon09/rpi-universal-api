import readFilePromise from 'fs-readfile-promise';

export class FileReader {

    public async readFile(path: string): Promise<Buffer |string> {
        const buffer = await readFilePromise(path);
        return buffer.toString();
    }
}
