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

增加锚点
```jsx
import { useRef, useEffect } from 'react'
import { ImageEditor, Editor } from 'image-editor';

export default () => {
  const ref = useRef<Editor>(null)

  useEffect(() => {
    console.log('ref', ref.current)
  }, [])

  return (
    <div>
      <button
        onClick={() => {
          ref.current?.createAnchor({
              position: { x: 40, y: 40 },
              extra: {
                text: '耐克鞋'
              }
            })
        }}
      >
        添加节点
      </button>
      <ImageEditor
        editorRef={ref}
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
      />
    </div>
  )
}
```