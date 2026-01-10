import { defineCollection, z } from 'astro:content'

const learn = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    navLabel: z.string().optional(),
    buttonLabel: z.string().optional(),
  })
})

export const collections = { learn }
