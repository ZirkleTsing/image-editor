# 图片编辑器

图片编辑器示例

```jsx
import { useEffect, useRef, useState } from 'react'
import { Editor } from 'image-editor';

export default () => {
  const ref = useRef(null)
  const [editor, setEditorInstance] = useState(null)
  useEffect(() => {
    const editor = Editor.create(ref.current, {
      dots: [{
        position: { x: 10, y: 10 }
      }],
      imageUrl: 'https://i.328888.xyz/2022/12/18/4M6XE.png',
      dotUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png'
    })
    setEditorInstance(editor)
    console.log('image-editor:', editor)
    console.log('@@', editor.dotPosition)
  }, [])
  return (
    <div ref={ref} style={{ width: '250px', height: '400px' }}>
    </div>
  )
}
```
