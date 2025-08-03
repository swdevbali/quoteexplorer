export interface Quote {
  id: string
  content: string
  author: string
  category: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}