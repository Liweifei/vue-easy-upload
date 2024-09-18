import SparkMD5 from "spark-md5";

const createChunk = (file, index, chunkSize) => {
    return new Promise((resolve) => {
        const start = index * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunkBlob = file.slice(start, end);
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const result = event.target.result;
            spark.append(result);
            resolve({ start, end, index, hash: spark.end(), blob: chunkBlob });
        };
        fileReader.readAsArrayBuffer(chunkBlob);
    })
}

self.onmessage = async (event) => {
    const { file,
        chunkSize,
        startChunkIndex,
        endChunkIndex} = event.data;
    const promiseList = []
    if (file &&
        chunkSize) {
        for (let i = startChunkIndex; i < endChunkIndex; i++) {
            promiseList.push(createChunk(file, i, chunkSize))
        }
        const formatChunks = await Promise.all(promiseList)
        // console.error(startChunkIndex, endChunkIndex);
        postMessage(formatChunks)
    }
};
