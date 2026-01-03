import Papa from 'papaparse'
import YAML from 'yaml'
import fs from 'node:fs'
import path from 'node:path'

export interface DirectoryEntry {
  name: string
  slug: string
  url: string
  description: string
  category: string
  subCategory: string
  chains: string[]
  status: string
  listed: boolean
  github: string
  docs: string
  twitter: string
  linkedin: string
  email: string
  telegram: string
}

export interface SubCategory {
  id: string
  name: string
  description: string
}

export interface Category {
  id: string
  name: string
  description: string
  'sub-categories'?: SubCategory[]
}

export interface GroupedDirectory {
  category: string
  items: DirectoryEntry[]
}

function parseCSV(csvContent: string): DirectoryEntry[] {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  return result.data.map((row) => ({
    name: row.name || '',
    slug: row.slug || '',
    url: row.url?.startsWith('http') ? row.url : `https://${row.url}`,
    description: row.description || '',
    category: row.category || '',
    subCategory: row['sub-category'] || '',
    chains: row.chains ? row.chains.split(',').map((c) => c.trim()).filter(Boolean) : [],
    status: row.status || '',
    listed: row.listed === 'true',
    github: row.github || '',
    docs: row.docs?.startsWith('http') ? row.docs : row.docs ? `https://${row.docs}` : '',
    twitter: row.x_twitter || '',
    linkedin: row.linkedin || '',
    email: row.email || '',
    telegram: row.telegram || '',
  }))
}

export function loadDirectory(): DirectoryEntry[] {
  const csvPath = path.join(process.cwd(), 'data', 'directory.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const entries = parseCSV(csvContent)
  return entries.filter((entry) => entry.listed)
}

export function loadCategories(): Category[] {
  const yamlPath = path.join(process.cwd(), 'data', 'categories.yaml')
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const data = YAML.parse(yamlContent)
  return data.categories
}

export function groupByCategory(entries: DirectoryEntry[]): GroupedDirectory[] {
  const categories = loadCategories()

  // Build category order from yaml
  const categoryOrder = categories.map((c) => c.name)

  const grouped = new Map<string, DirectoryEntry[]>()

  // Initialize groups in order
  categoryOrder.forEach((cat) => grouped.set(cat, []))

  // Group entries
  entries.forEach((entry) => {
    const existing = grouped.get(entry.category)
    if (existing) {
      existing.push(entry)
    } else {
      // Handle unknown categories
      grouped.set(entry.category, [entry])
    }
  })

  // Sort items within each category alphabetically
  grouped.forEach((items) => {
    items.sort((a, b) => a.name.localeCompare(b.name))
  })

  // Convert to array, maintaining order and filtering empty groups
  return categoryOrder
    .filter((cat) => (grouped.get(cat)?.length ?? 0) > 0)
    .map((cat) => ({
      category: cat,
      items: grouped.get(cat) || [],
    }))
}

export function getGroupedDirectory(): GroupedDirectory[] {
  const entries = loadDirectory()
  return groupByCategory(entries)
}
