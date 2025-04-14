// app/actions/saveArticle.ts
'use server'

import { revalidateTag } from "next/cache"

export async function customRevalidateTag(tag: string){
  revalidateTag(tag);
}
