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
      <div style={{ marginBottom: '7px' }}>
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
          添加锚点
        </button>
      </div>
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

选中锚点后高亮
```jsx
import { ImageEditor } from 'image-editor';
export default () => {
  return (
    <ImageEditor
      onSelect={(id) => {
        console.log('onSelect:', id)
      }}
      config={{
        anchors: [
          {
            position: { x: 28, y: 14 },
            extra: {
              text: '连衣裙'
            }
          },
          {
            position: { x: 50, y: 60 },
            extra: {
               text: '帽子'
            }
          }
        ],
        imageUrl: 'https://i.328888.xyz/2022/12/18/4M6XE.png',
        anchorUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png',
      }}
      renderItem={(context) => {
        return (
          <div style={{ color: context.active ? 'red' : undefined }}>测试</div>
        ) 
      }}
    />
  )
}
```