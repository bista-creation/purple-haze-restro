'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  RefreshCw,
  X,
  Camera,
} from 'lucide-react'
import { FOOD_PHOTO_PRESETS, FoodPhotoPreset } from '@/lib/data/food-photo-presets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DishPictureFacilityProps {
  currentUrl?: string
  onChange: (url: string) => void
  dishName?: string
}

export function DishPictureFacility({
  currentUrl,
  onChange,
  dishName = 'Dish',
}: DishPictureFacilityProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'upload'>('presets')
  const [presetFilter, setPresetFilter] = useState<string>('all')
  const [urlInput, setUrlInput] = useState(currentUrl || '')
  const [previewError, setPreviewError] = useState(false)

  const filteredPresets =
    presetFilter === 'all'
      ? FOOD_PHOTO_PRESETS
      : FOOD_PHOTO_PRESETS.filter((p) => p.category === presetFilter)

  const handleSelectPreset = (preset: FoodPhotoPreset) => {
    setUrlInput(preset.url)
    setPreviewError(false)
    onChange(preset.url)
  }

  const handleUrlChange = (val: string) => {
    setUrlInput(val)
    setPreviewError(false)
    onChange(val)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, or WebP).')
      return
    }

    // Convert file to high-res Base64 Data URL for immediate zero-config persistence
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) {
        setUrlInput(dataUrl)
        setPreviewError(false)
        onChange(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-primary" /> Dish Photography & Presentation
        </label>
        {currentUrl && (
          <button
            type="button"
            onClick={() => {
              setUrlInput('')
              onChange('')
            }}
            className="text-[11px] text-destructive hover:underline font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear Image
          </button>
        )}
      </div>

      {/* Picture Preview Card */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/60 border border-border">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-background border border-border shadow-xs">
          {currentUrl && !previewError ? (
            <Image
              src={currentUrl}
              alt={dishName}
              fill
              unoptimized
              onError={() => setPreviewError(true)}
              className="object-cover transition-transform hover:scale-105 duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
              <span className="text-[10px] leading-tight font-medium">No photo selected</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-foreground truncate">
            {dishName || 'Selected Dish Preview'}
          </h4>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 font-medium">
            High-contrast photography improves online orders and banquet bookings by over 40%.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {currentUrl?.startsWith('data:') ? 'Local Upload' : currentUrl ? 'Active URL' : 'Default'}
            </span>
            {currentUrl && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full space-y-3"
      >
        <TabsList className="grid grid-cols-3 w-full h-9 rounded-xl bg-muted p-1">
          <TabsTrigger value="presets" className="text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-gold-500" /> Curated Presets
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs font-bold rounded-lg flex items-center gap-1.5">
            <LinkIcon className="w-3 h-3" /> Image URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Upload className="w-3 h-3" /> Upload File
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Curated Food Presets */}
        <TabsContent value="presets" className="space-y-3 pt-1">
          {/* Preset Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'nepali', label: '🇳🇵 Nepali' },
              { id: 'indian', label: '🇮🇳 Indian' },
              { id: 'chinese', label: '🥢 Asian' },
              { id: 'italian', label: '🍕 Italian' },
              { id: 'grill', label: '🔥 Grills' },
              { id: 'drinks', label: '🍹 Drinks' },
              { id: 'desserts', label: '🍰 Sweets' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setPresetFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  presetFilter === cat.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preset Thumbnails Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-border rounded-xl bg-background">
            {filteredPresets.map((preset) => {
              const isSelected = currentUrl === preset.url
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative rounded-xl overflow-hidden aspect-video border text-left transition-all ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-1 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={preset.url}
                    alt={preset.title}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-white line-clamp-1 leading-tight drop-shadow-sm">
                      {preset.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Custom URL */}
        <TabsContent value="url" className="space-y-2 pt-1">
          <label className="text-[11px] font-semibold text-muted-foreground block">
            Paste any direct image URL (Unsplash, Cloudinary, Imgur, or direct CDN):
          </label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="/images/my-cuisine-photo.jpg or https://..."
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>
          {previewError && (
            <p className="text-[11px] text-destructive font-medium">
              Could not load the specified image URL. Please verify the link.
            </p>
          )}
        </TabsContent>

        {/* Tab 3: Local File Upload */}
        <TabsContent value="upload" className="space-y-2 pt-1">
          <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 text-center transition-colors">
            <input
              type="file"
              id="dish-file-upload"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="dish-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="w-6 h-6 text-primary mb-1.5" />
              <span className="text-xs font-bold text-foreground">
                Click to Choose Image from Computer or Phone
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Supports JPG, PNG, WEBP (Max 5MB)
              </span>
            </label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
