# 图片编辑器

## 图片编辑器示例
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

## 增加锚点
```tsx
import React, { useRef, useEffect } from 'react'
import { ImageEditor, Editor, generateUuid } from 'image-editor';

export default () => {
  const editorRef = useRef<Editor<{ text: string }>>(null)

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

## 选中锚点后高亮
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

## 更新操作
```tsx
import React, { useRef, useEffect, useState, useMemo, Fragment } from 'react'
import { ImageEditor, Editor, generateUuid, ImageEditorProps, AnchorType } from 'image-editor';

const fetchFromServerAnchorsValue = [
  {
    uuid: generateUuid(), // uuid必须要
    position: { x: 28, y: 14 },
    extra: {
      text: '连衣裙'
    }
  },
  {
    uuid: generateUuid(),
    position: { x: 50, y: 60 },
    extra: {
        text: '帽子'
    }
  }
]

interface IComponent {
  anchors: Array<AnchorType<{ text: string }>>
  onChange: any
}

const Component: React.FC<IComponent> = (props) => {
  const imageUrl = 'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png'
  const editorRef = useRef<Editor>(null)
  
  const handleOnChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const anchors = props.anchors?.concat()
    const target = anchors.find(anchor => anchor.uuid === id)!
    const extra = {
      ...target.extra,
      text: e.target.value
    }
    target.extra = extra
    props.onChange({ anchors })
    editorRef.current?.updateAnchor(id, extra)
  }

  const handleDelete = (id: string) => () => {
    console.log('delete', id)
    const anchors = props.anchors?.concat()
    const index = props.anchors?.findIndex(anchor => anchor.uuid === id)
    anchors?.splice(index, 1)
    props.onChange({ anchors })
    editorRef.current?.deleteAnchor(id)
  }
  
  const handleAdd = () => {
    const anchors = props.anchors?.concat()
    const payload = {
      position: { x: 40, y: 40 },
      extra: {
        text: '耐克鞋'
      },
      uuid: generateUuid()
    }
    anchors.push(payload)
    props.onChange({ anchors })
    editorRef.current?.createAnchor(payload)
  }

  const handleFocus = (id: string) => () => {
    if (editorRef.current) {
      editorRef.current.activeAnchor = id
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '500px' }}>
        {props.anchors.map(anchor => {
          return (
            <div
              key={anchor.uuid}
            >
              <input
                value={anchor.extra.text}
                onFocus={handleFocus(anchor.uuid)}
                onChange={handleOnChange(anchor.uuid)}
              />
              <button onClick={handleDelete(anchor.uuid)}>删除</button>
            </div>
          )
        })}
        <button onClick={handleAdd}>增加</button>
      </div>
      <div style={{ flex: 1 }}>
        <ImageEditor
          ref={editorRef}
          onChange={props.onChange}
          config={{
            imageUrl,
            anchors: props.anchors?.map((anchor) => {
              return {
                ...anchor,
                uuid: anchor.uuid
              }
            })
          }}
          renderItem={(context) => {
            return (
              <div
                style={{ color: context.active ? 'red' : undefined }}
              >
                {context.extra.text}
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default () => {
  const [anchors, setAnchors] = useState(fetchFromServerAnchorsValue)

  const onChange = ({ anchors }: any) => {
    console.log('onChange anchors:', anchors)
    setAnchors(anchors)
  }

  return (
    <Component anchors={anchors} onChange={onChange} />
  )
}

```