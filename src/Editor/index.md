# 图片编辑器

图片编辑器示例

```jsx
import { ImageEditor, generateUuid } from 'image-editor';

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
            uuid: '11',
            position: { x: 10, y: 10 },
            extra: {
              text: '连衣裙'
            }
          },
          {
            uuid: '22',
            position: { x: 20, y: 20 },
            extra: {
               text: '帽子'
            }
          }
        ],
        imageUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
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
import { ImageEditor, Editor, generateUuid } from 'image-editor';

export default () => {
  const editorRef = useRef<Editor>(null)

  return (
    <div>
      <div style={{ marginBottom: '7px' }}>
        <button
          onClick={() => {
            editorRef.current?.createAnchor({
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
        ref={editorRef}
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
              uuid: generateUuid(),
              position: { x: 10, y: 10 },
              extra: {
                text: '连衣裙'
              }
            },
            {
              uuid: '33',
              position: { x: 20, y: 20 },
              extra: {
                text: '帽子'
              }
            }
          ],
          imageUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
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
        imageUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
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