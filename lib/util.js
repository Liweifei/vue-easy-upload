const accDiv = (val, valTwo) => {
	const strVal = val.toString();
	const strValTwo = valTwo.toString();
	const index = strVal.indexOf('.');
	const indexTwo = strValTwo.indexOf('.');
	const num = [0, 0];
	if (index > -1) {
		num[0] = strVal.length - 1 - index;
	}
	if (indexTwo > -1) {
		num[1] = strValTwo.length - 1 - index;
	}
	return (
		Math.round(val * Math.pow(10, num[0])) /
		(Math.round(valTwo * Math.pow(10, num[1])) * Math.pow(10, num[0] - num[1]))
	);
};
const FileTool = {
	getFileType(file) {
		//根据返回的路径判断文件的类型
		//fileurl传带后缀的文件名或其他=>带后缀
		//img pdf audio video txt ppt word excel zip file
		const fileurl = file.fileurl || file.name;//兼容列表返回的用fileurl|el默认封装的name是带后缀的
		let url = fileurl.toLowerCase(); //防止大写
		const fileType =
			/.(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|wmf|jpeg|ico)$/.test(url)
				? "image"
				: /.(pdf)$/.test(url) ? "pdf"
					: /.(wav|mp3|ogg)$/.test(url)
						? "audio"
						: /.(avi|wmv|mkv|mp4|mov|rm|3gp|flv|mpg|rmvb)$/.test(url)
							? "video"
							: /.(txt)$/.test(url)
								? "txt"
								: /.(ppt|pptx)$/.test(url)
									? "ppt"
									: /.(doc|docx)$/.test(url)
										? "word"
										: /.(xls|xlsx)$/.test(url)
											? "excel"
											: /.(zip|rar)$/.test(url)
												? "zip"
												: "file";
		return fileType;
	},
	formatFileSize(fileSize) {
		if (fileSize < 1024) {
			return fileSize + 'B';
		} else if (fileSize < (1024 * 1024)) {
			return `${accDiv(fileSize, 1024).toFixed(2)}KB`;
		} else if (fileSize < (1024 * 1024 * 1024)) {
			return `${accDiv(fileSize, (1024 * 1024)).toFixed(2)}MB`;
		} else if (fileSize < (1024 * 1024 * 1024 * 1024)) {
			return `${accDiv(fileSize, (1024 * 1024 * 1024)).toFixed(2)}GB`;
		} else {
			return "未知大小";
		}
	}
}
export default FileTool;