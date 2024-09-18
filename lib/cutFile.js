import SparkMD5 from "spark-md5";
import MyWorker from './myWorker.worker.js';
const THREADS = navigator.hardwareConcurrency || 4;//获取最大线程数

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

const cutFile = async (file, chunkSize) => {
    return new Promise((resolve) => {
        const totalChunks = Math.ceil(file.size / chunkSize);
        const cutResults = [];

        if (typeof Worker !== 'undefined') {
            const perChunksWorker = Math.ceil(totalChunks / THREADS);
            const needOpenWorkers = totalChunks < THREADS ? totalChunks : THREADS;//16核但是只有两个分块，那也只用循环两次
            // console.log(totalChunks, perChunksWorker, needOpenWorkers);
            let finishedChunks = 0;
            for (let i = 0; i < needOpenWorkers; i++) {
                const startChunkIndex = i * perChunksWorker;
                const endChunkIndex = Math.min(totalChunks, startChunkIndex + perChunksWorker);

                const webWorker = new MyWorker();
                // console.error(startChunkIndex, endChunkIndex);
                webWorker.postMessage({
                    file: file,
                    chunkSize,
                    startChunkIndex,
                    endChunkIndex,
                })
                webWorker.onmessage = (event) => {
                    // 处理worker返回的消息
                    webWorker.terminate();
                    for (let i = startChunkIndex; i < endChunkIndex; i++) {
                        const chunkResult = event.data[i - startChunkIndex];//因为返回来的数据是从0开始的，循环不是从0开始所有-startIndex
                        cutResults[i] = chunkResult;//
                    }
                    finishedChunks++;
                    if (finishedChunks === needOpenWorkers) {
                        const fileHash = SparkMD5.ArrayBuffer.hash(cutResults.map(item => item.hash));
                        console.log(fileHash);
                        resolve({
                            file,
                            fileHash,
                            totalChunks,
                            splitChunks: cutResults
                        })
                        // console.log('all chunks processed', cutResults);
                    }
                }
            }
        } else {
            for (let i = 0; i < totalChunks; i++) {
                createChunk(file, i, chunkSize).then((chunkResult) => {
                    cutResults[i] = chunkResult;
                    if (cutResults.length === totalChunks) {
                        const fileHash = SparkMD5.ArrayBuffer.hash(cutResults.map(item => item.hash));
                        console.log(fileHash);
                        resolve({
                            file,
                            fileHash,
                            totalChunks,
                            splitChunks: cutResults
                        })
                    }
                })
            }
        }

    })

}
export default async (files, fragmentSize) => {
    const promiseList = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        promiseList.push(file.size > fragmentSize ? cutFile(file, fragmentSize) : {file})
    }
    const result = await Promise.all(promiseList)
    return result;
}