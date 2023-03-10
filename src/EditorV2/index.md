# 图片编辑器

## 图片编辑器示例

```tsx
import React, { useRef, useEffect } from 'react'
import { ImageEditorV2 } from 'image-editor';

export default () => {
  const editorRef = useRef(null)

  useEffect(() => {
    console.log('editorRef', editorRef.current)
  }, [])

  return (
    <ImageEditorV2
      ref={editorRef}
      containerStyle={{ width: 600, height: 600 }}
      positions={[
        { left: 80, top: 80, width: 120, height: 120 },
        { left: 20, top: 20, width: 40, height: 40 }
      ]}
      images={[
        'https://images.pexels.com/photos/3791466/pexels-photo-3791466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/36487/above-adventure-aerial-air.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        // 'https://images.pexels.com/photos/4339514/pexels-photo-4339514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        // 'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png',
        'https://img.alicdn.com/imgextra/i1/O1CN01Hbl8j41i5O2vFcI6K_!!6000000004361-2-tps-430-654.png'
      ]}
    />
  );
};
```
