export interface OwnPropertyComment { id: number; hidden: boolean }

export interface ModerateCommentPayload { hidden: boolean; note?: string }

export interface AdminPropertyComment extends PropertyComment {
  hidden: boolean
  moderationNote: string | null
  moderatedAt: string | null
  moderatedById: number | null
  property: { id: number; title: string }
}

export interface PropertyComment {
  id: number
  content: string
  createdAt: string
  author: { id: number; name: string }
}
