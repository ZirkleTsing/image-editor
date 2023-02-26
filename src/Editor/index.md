# 图片编辑器

## 图片编辑器示例

```tsx
import React from 'react'
import { ImageEditor, generateUuid } from 'image-editor';

export default () => {
  return (
    <ImageEditor
      onChange={(value) => {
        console.log('change:', value);
      }}
      onDragStart={(value) => {
        console.log('onDragStart id:', value);
      }}
      onDragEnd={(value) => {
        console.log('onDragEnd id:', value);
      }}
      config={{
        anchors: [
          {
            uuid: '11',
            position: { x: 0.1, y: 0.1 },
            extra: {
              text: '连衣裙',
            },
          },
          {
            uuid: '22',
            position: { x: 0.2, y: 0.2 },
            extra: {
              text: '帽子',
            },
          },
        ],
        imageUrl:
          'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
      }}
      root={document.body}
      // renderItem={(context) => {
      //   return (
      //     <div>测试</div>
      //   )
      // }}
    />
  );
};
```

## 增加锚点

```tsx
import { Editor, generateUuid, ImageEditor } from 'image-editor';
import React, { useRef } from 'react';

export default () => {
  const editorRef = useRef<Editor<{ text: string }>>(null);

  return (
    <div>
      <div style={{ marginBottom: '7px' }}>
        <button
          onClick={() => {
            editorRef.current?.upsertAnchor(generateUuid(), {
              text: '耐克鞋',
            });
          }}
        >
          添加锚点
        </button>
      </div>
      <ImageEditor
        ref={editorRef}
        onChange={(value) => {
          console.log('change:', value);
        }}
        onDragStart={(value) => {
          console.log('onDragStart id:', value);
        }}
        onDragEnd={(value) => {
          console.log('onDragEnd id:', value);
        }}
        config={{
          anchors: [
            {
              uuid: generateUuid(),
              position: { x: 0.1, y: 0.1 },
              extra: {
                text: '连衣裙',
              },
            },
            {
              uuid: '33',
              position: { x: 0.2, y: 0.2 },
              extra: {
                text: '帽子',
              },
            },
          ],
          imageUrl:
            'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
        }}
      />
    </div>
  );
};
```

## 选中锚点后高亮

```tsx
import React from 'react'
import { ImageEditor } from 'image-editor';
export default () => {
  return (
    <ImageEditor
      onSelect={(id) => {
        console.log('onSelect:', id);
      }}
      config={{
        anchors: [
          {
            position: { x: 0.24, y: 0.12 },
            extra: {
              text: '连衣裙',
            },
          },
          {
            position: { x: 0.4, y: 0.53 },
            extra: {
              text: '帽子',
            },
          },
        ],
        imageUrl:
          'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
      }}
      renderItem={(context) => {
        return (
          <div style={{ color: context.active ? 'red' : undefined }}>测试</div>
        );
      }}
    />
  );
};
```

## 更新操作

```tsx
import { AnchorType, Editor, generateUuid, ImageEditor } from 'image-editor';
import React, { useRef, useState } from 'react';

const fetchFromServerAnchorsValue = [
  {
    uuid: generateUuid(), // uuid必须要
    position: { x: 0.16, y: 0.12 },
    extra: {
      text: '连衣裙',
    },
  },
  {
    uuid: generateUuid(),
    position: { x: 0.5, y: 0.67 },
    extra: {
      text: '帽子',
    },
  },
];

type Extra = {
  text: string;
};

interface IComponent {
  anchors: Array<AnchorType<Extra>>;
  onChange: any;
}

const Component: React.FC<IComponent> = (props) => {
  const imageUrl =
    'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png';
  const editorRef = useRef<Editor<Extra>>(null);

  const handleOnChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const anchors = props.anchors?.concat();
      const target = anchors.find((anchor) => anchor.uuid === id)!;
      const extra = {
        ...target.extra,
        text: e.target.value,
      };
      target.extra = extra;
      props.onChange({ anchors });
      editorRef.current?.upsertAnchor(id, extra);
    };

  const handleDelete = (id: string) => () => {
    console.log('delete', id);
    const anchors = props.anchors?.concat();
    const index = props.anchors?.findIndex((anchor) => anchor.uuid === id);
    anchors?.splice(index, 1);
    props.onChange({ anchors });
    editorRef.current?.deleteAnchor(id);
  };

  const handleAdd = () => {
    const anchors = props.anchors?.concat();
    const payload = {
      position: { x: 0.32, y: 0.17 },
      extra: {
        text: '耐克鞋',
      },
      uuid: generateUuid(),
    };
    editorRef.current?.upsertAnchor(generateUuid(), { text: '测试锚点' });
  };

  const handleFocus = (id: string) => () => {
    if (editorRef.current) {
      editorRef.current.activeAnchor = id;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '500px' }}>
        {props.anchors.map((anchor) => {
          return (
            <div key={anchor.uuid}>
              <input
                value={anchor.extra.text}
                onFocus={handleFocus(anchor.uuid)}
                onChange={handleOnChange(anchor.uuid)}
              />
              <button onClick={handleDelete(anchor.uuid)}>删除</button>
            </div>
          );
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
                uuid: anchor.uuid,
              };
            }),
          }}
          renderItem={(context) => {
            return (
              <div style={{ color: context.active ? 'red' : undefined }}>
                {context.extra.text}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default () => {
  const [anchors, setAnchors] = useState(fetchFromServerAnchorsValue);

  const onChange = ({ anchors }: any) => {
    console.log('onChange anchors:', anchors);
    setAnchors(anchors);
  };

  return <Component anchors={anchors} onChange={onChange} />;
};
```
