import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Posts from './components/posts'

export default function App() {
  return (
    <>
      <Header />
      <Posts />
    </>
  )
}