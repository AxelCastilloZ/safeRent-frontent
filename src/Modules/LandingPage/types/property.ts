export interface Property {
  id: number
  title: string
  location: string
  price: number
  currency: string
  image: string
  rating: number
  reviews: number
  available: boolean
  verified?: boolean
  services: string[]
}
