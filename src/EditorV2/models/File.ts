
import { makeObservable, observable, action, computed } from 'mobx';
import { isFile, isNull } from '../shared'
import { getObjectURL, dataURLtoFile, calcImageSize, toImage, toSize } from '../internal'
import type { Editor } from '.'

interface ImageFileProps {
  file: File | string
}

class ImageFile {
  data: string | null = null
  originFile: string = ''
  fileName: string = ''
  fetching: boolean = false
  editor: Editor
  // 像素
  naturalHeight: number = 0
  naturalWidth: number = 0
  // 大小
  size: string = ''
  constructor(props: ImageFileProps, editor: Editor) {
    this.editor = editor
    const { file } = props
    this.originFile = isFile(file) ? getObjectURL(file) : file
    this.fileName = isFile(file) ? file.name : file.split("/")[file.split("/").length - 1]
    
    makeObservable(this, {
      fileName: observable,
      data: observable,
      fetching: observable,
      editor: observable,
      naturalHeight: observable,
      naturalWidth: observable,
      size: observable,
      loaded: computed,
      name: computed,
      content: computed,
      read: action,
      // getImageFileAdaptToCanvas: action
    })
  }

  get loaded() {
    if (!this.editor.container) return false // 编辑器未准备好
    if (!this.data && !this.fetching) {
      this.read()
    }
    return !!this.data
  }

  get content() {
    if (this.loaded) {
      return this.data
    }
  }

  get name() {
    return this.fileName
  }

  read() {
    if (this.data) return Promise.resolve(this.data)
    this.fetching = true
    return new Promise<any>((resolve, reject) => {
      this.getImageFileAdaptToCanvas(this.originFile, this.fileName).then(async ({ file, err }) => {
        if (err || isNull(file)) {
          console.warn('图像资源加载失败')
          reject(err)
        } else {
          this.data = getObjectURL(file)
          this.fetching = false
          const img = await toImage(this.data)
          this.naturalHeight = img.naturalHeight
          this.naturalWidth = img.naturalWidth
          this.size = toSize(file.size)
          resolve(this.data)
        }
      })
    })
  }

  getImageFileAdaptToCanvas(
    url: string,
    fileName: string,
  ): Promise<{ file: File | null; err: any }> {
    let suffix = fileName.split('.')[fileName.split('.').length - 1];
    suffix = suffix.replace('jpg', 'jpeg');
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
        // const editorWidth = this.editor.width
        // const editorHeight = this.editor.height
        const { width, height } = calcImageSize(img, this.editor)
        cvs.width = width;
        cvs.height = height;
        // console.log('@:', img.height, editorHeight)
        const sx = 0;
        const sy = 0;
        ctx?.drawImage(
          img,
          sx,
          sy,
          img.width, // 裁剪原图片的尺寸
          img.height, // 裁剪原图片的尺寸
          0,
          0,
          cvs.width,
          cvs.height,
        );
        resolve({
          file: dataURLtoFile(cvs.toDataURL(`image/${suffix}`, 1), fileName),
          err: null,
        });
      };
      img.onerror = (err) => {
        resolve({ file: null, err });
      };
    });
  }
}

export default ImageFile