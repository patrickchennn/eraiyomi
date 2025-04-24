"use client"

import CreateNewPost from '@/components/blog/create_post/CreateNewPost'
import chalk from 'chalk'
import React from 'react'

export default function NewPost(){
  console.info(chalk.blueBright.bgBlack("Page: /compose/post"))
  return (
    <CreateNewPost/>
  )
}