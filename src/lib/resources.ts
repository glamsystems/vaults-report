import Papa from 'papaparse'
import fs from 'node:fs'
import path from 'node:path'

export interface Resource {
  name: string
  url: string
  description: string
  category: string
  source: string
  date: string
}

function parseCSV(csvContent: string): Resource[] {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  return result.data.map((row) => ({
    name: row.name?.trim() || '',
    url: row.url?.startsWith('http') ? row.url : `https://${row.url}`,
    description: row.description?.trim() || '',
    category: row.category?.trim() || '',
    source: row.source?.trim() || '',
    date: row.date?.trim() || '',
  }))
}

export function loadResources(): Resource[] {
  const csvPath = path.join(process.cwd(), 'data', 'resources.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  return parseCSV(csvContent)
}
