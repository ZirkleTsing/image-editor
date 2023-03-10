import { observable } from 'mobx'

const threshold = 10;

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
};

type Size = {
  height: number;
  width: number;
};

export const calcImageSize = (
  image: HTMLImageElement,
  editorSize: Size,
): Size => {
  const imageHeight = image.height;
  const imageWidth = image.width;
  const editorHeight = editorSize.height;
  // 目标 不能出现垂直滚动
  if (imageHeight > editorHeight - threshold) {
    return {
      height: editorHeight - threshold,
      width: ((editorHeight - threshold) / imageHeight) * imageWidth,
    };
  }

  return {
    height: imageHeight,
    width: imageWidth,
  };
};

/* url转img对象 */
export const toImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = typeof url === 'string' ? url : getObjectURL(url);
    img.onload = function () {
      resolve(img);
    };
  });
};

// 通过字节计算文件大小
export const toSize = (bytes: File['size']): string => {
  let _bytes = bytes;
  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let exp = Math.floor(Math.log(bytes) / Math.log(2));
  if (exp < 1) {
    exp = 0;
  }
  const i = Math.floor(exp / 10);
  _bytes = _bytes / Math.pow(2, 10 * i);

  if (_bytes.toString().length > _bytes.toFixed(2).toString().length) {
    _bytes = Number(_bytes.toFixed(2));
  }
  return _bytes + ' ' + symbols[i];
};

export const isElementsOverlap = (el1: HTMLElement, el2: HTMLElement): boolean => {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );
};

export const nextTick = (callback?: () => void) => Promise.resolve(0).then(callback)


export const SelectEventList = observable<SeletEvent>([])

type SeletEvent = (payload: any) => void

export const registerSelectEvent = (event: SeletEvent) => {
  SelectEventList.push(event)
}

export const unregisterSelectEvent = (event: SeletEvent) => {
  SelectEventList.splice(SelectEventList.indexOf(event), 1)
}

export const dispatchSelectEvent = (payload: any) => {
  SelectEventList.forEach(handler => {
    handler(payload)
  })
}