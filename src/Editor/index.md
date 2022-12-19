# 图片编辑器

图片编辑器示例

```jsx
import { ImageEditor } from 'image-editor';

export default () => {
  return (
    <ImageEditor
      config={{
        dots: [
          {
            position: { x: 10, y: 10 }
          },
          {
            position: { x: 20, y: 20 }
          }
        ],
        imageUrl: 'https://i.328888.xyz/2022/12/18/4M6XE.png',
        dotUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png'
      }}
    />
  )
}
```
