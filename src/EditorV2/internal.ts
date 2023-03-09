export const getObjectURL = (file: File) => {
  let url = '';
  if (window.webkitURL !== undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  } else if (window.URL !== undefined) {
    // mozilla
    url = window.URL.createObjectURL(file);
  }
  return url;
};

// 将base64转换成file对象
export const dataURLtoFile = (dataurl: string, filename = 'file.png') => {
  let arr = dataurl.split(',');
  let mime = arr[0]?.match(/:(.*?);/)?.[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  let file = new File([u8arr], `${filename}`, {
    type: mime,
  });

  return file;
}

type Size = {
  height: number
  width: number
};

const threshold = 10
export const calcImageSize = (image: HTMLImageElement, editorSize: Size, ): Size => {
  const imageHeight = image.height
  const imageWidth = image.width
  const editorHeight = editorSize.height
  // 目标 不能出现垂直滚动
  if (imageHeight > editorHeight - threshold) {
    return {
      height: editorHeight - threshold,
      width: ((editorHeight - threshold) / imageHeight) * imageWidth
    }
  }

  return {
    height: imageHeight,
    width: imageWidth
  }
}

/* url转img对象 */
export const toImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
      let img = new Image()
      img.src = typeof (url) === 'string' ? url : getObjectURL(url)
      img.onload = function () {
        resolve(img)
      }
  })
};

// 通过字节计算文件大小
export const toSize = (bytes: File['size']): string => {
  let _bytes = bytes
  const symbols = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let exp = Math.floor(Math.log(bytes) / Math.log(2));
  if (exp < 1) {
      exp = 0;
  }
  const i = Math.floor(exp / 10);
  _bytes = _bytes / Math.pow(2, 10 * i);

  if (_bytes.toString().length > _bytes.toFixed(2).toString().length) {
      _bytes = Number(_bytes.toFixed(2));
  }
  return _bytes + " " + symbols[i];
}