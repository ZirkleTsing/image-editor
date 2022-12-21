# 图片编辑器

图片编辑器示例

```jsx
import { ImageEditor } from 'image-editor';

export default () => {
  return (
    <ImageEditor
      onChange={(value) => {
        console.log('change:', value)
      }}
      onDragStart={(value) => {
        console.log('onDragStart id:', value)
      }}
       onDragEnd={(value) => {
        console.log('onDragEnd id:', value)
      }}
      config={{
        anchors: [
          {
            position: { x: 10, y: 10 },
            extra: {
              text: '连衣裙'
            }
          },
          {
            position: { x: 20, y: 20 },
            extra: {
               text: '帽子'
            }
          }
        ],
        imageUrl: 'https://i.328888.xyz/2022/12/18/4M6XE.png',
        anchorUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png',
      }}
      // renderItem={(context) => {
      //   return (
      //     <div>测试</div>
      //   ) 
      // }}
    />
  )
}
```
