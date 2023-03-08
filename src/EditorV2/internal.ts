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
  const editorWidth = editorSize.width

  // 目标 不能出现垂直滚动
  if (imageHeight > editorHeight - threshold) {
    return {
      height: editorHeight - threshold,
      width: ((editorHeight - threshold) / imageHeight) * editorWidth
    }
  }

  return {
    height: imageHeight,
    width: imageWidth
  }
}