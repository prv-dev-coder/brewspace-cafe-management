import { PortalEmptyState } from "@/components/portal/empty-states"
import { GlassCard } from "@/components/portal/glass-card"
import { Button } from "@/components/ui/button"
import { ShoppingCartIcon, HeartIcon } from "lucide-react"
import Image from "next/image"

export default function FavoritesPage() {
  // Placeholder for real data fetch
  const favorites: any[] = [
    {
      id: "1",
      name: "Artisan Cappuccino",
      description: "Double shot espresso with velvety steamed milk.",
      price: 5.50,
      image_url: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400",
      category: "Coffee"
    },
    {
      id: "2",
      name: "Blueberry Muffin",
      description: "Freshly baked with local wild berries.",
      price: 3.75,
      image_url: "https://images.unsplash.com/photo-1607958674115-05b24858a945?auto=format&fit=crop&q=80&w=400",
      category: "Pastries"
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-muted-foreground mt-1">Quickly access the items you love most.</p>
      </div>

      {favorites.length === 0 ? (
        <PortalEmptyState 
          title="No favorites yet" 
          description="Start marking items as favorites to see them here." 
          icon="heart" 
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <GlassCard key={item.id} hoverEffect className="group overflow-hidden flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src={item.image_url} 
                  alt={item.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute top-3 right-3">
                  <Button size="icon" variant="secondary" className="size-8 rounded-full bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/40">
                    <HeartIcon className="size-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.category}
                  </span>
                  <span className="font-bold text-foreground">${item.price.toFixed(2)}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                  {item.description}
                </p>
                <Button className="w-full gap-2 rounded-xl">
                  <ShoppingCartIcon className="size-4" />
                  Add to Order
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
