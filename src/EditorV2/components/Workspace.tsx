import React from 'react'
import { observer } from "mobx-react-lite"
import { default as Toolbar } from './Toolbar'
import { default as Canvas } from './Canvas'

// 画布
export const WorkSpace: React.FC= observer(() => {
  return (
    <div>
      <Toolbar />
      <Canvas />
    </div>
  )
})

