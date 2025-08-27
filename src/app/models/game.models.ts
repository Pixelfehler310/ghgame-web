// Global game configuration
export interface GameConfig {
  totalStages: number;
  deadlineISO: string; // e.g. "2025-09-30T21:59:59.000Z" (UTC)
  hotbarSlots: number; // typically 9
}

// Inventory / Item
export interface InventoryItemDef {
  id: string; // e.g. "iron_pickaxe"
  name: string; // e.g. "Eisenspitzhacke"
  iconUrl: string; // CDN/asset
}

// Dialog
export interface DialogChunk {
  id: string;
  text: string; // Richtext optional (Markdown/BBCode)
  mood?: 'neutral' | 'happy' | 'worried' | 'angry';
  delayMs?: number; // optional for typewriter/auto-advance
}

// Input types for a question
export type QuestionInput =
  | {
      kind: 'text';
      placeholder?: string;
      minLength?: number;
      maxLength?: number;
      caseSensitive?: boolean;
      pattern?: string; // RegExp source
    }
  | { kind: 'number'; min?: number; max?: number; step?: number; integerOnly?: boolean }
  | { kind: 'choice'; multiple?: boolean; options: { id: string; label: string; value: string }[] }
  /* Removed boolean variant for simplification */
  | { kind: 'date'; min?: string; max?: string }
  | { kind: 'time' }
  | {
      kind: 'coordinate';
      labels?: { x?: string; y?: string };
      minX?: number;
      maxX?: number;
      minY?: number;
      maxY?: number;
    }
  | { kind: 'code'; language?: 'json' | 'javascript' | 'plaintext'; maxLength?: number }
  | { kind: 'regex'; description?: string }
  | { kind: 'uploadOnly' }; // New special stage: only an image upload, no textual answer

// Data-driven correctness checks
export type AnswerCheck =
  | { mode: 'exact'; expected: string | number | string[] | boolean; caseSensitive?: boolean }
  | { mode: 'anyOf'; expected: Array<string | number> }
  | { mode: 'range'; min?: number; max?: number }
  | { mode: 'regex'; pattern: string; flags?: string }
  | { mode: 'coordinateWithin'; rect: { minX: number; maxX: number; minY: number; maxY: number } };

// Upload requirement per stage
export interface UploadRequirement {
  required: boolean;
  acceptMime: string[]; // ["image/png","image/jpeg"]
  maxSizeMB: number; // e.g. 5
  instructions?: string; // brief text for modal
}

// A single stage
export interface Stage {
  id: string; // e.g. "stage-03"
  index: number; // 1-based
  item: InventoryItemDef; // reward item
  title?: string; // optional story title
  /** Optional human readable location name (from data.csv LOCATION). */
  locationName?: string;
  npcDialog: DialogChunk[]; // story + question
  question: {
    prompt: string;
    input: QuestionInput;
    /** Optional now; for 'uploadOnly' stages there is no answer validation. */
    check?: AnswerCheck;
    triesAllowed?: number; // default: unlimited
    hintAfterTries?: number; // show hint after N tries
    hintText?: string;
  };
  upload: UploadRequirement;
  assets?: { itemImage?: string; background?: string };
  /** Optional maps link for this stage/location (from data.csv KOORDINATEN). */
  mapUrl?: string;
}

// Runtime state
export interface UploadedFile {
  id: string;
  fileName: string;
  mime: string;
  size: number;
  url: string; // blob/object URL or CDN
}

export interface StageProgress {
  stageId: string;
  answered: boolean;
  correct: boolean;
  userAnswer?: unknown;
  upload?: UploadedFile;
  obtainedItemId?: string; // item.id
  completedAt?: string; // ISO
}

export interface GameState {
  currentStageIndex: number; // 1..totalStages
  inventory: InventoryItemDef[]; // acquisition order
  progress: Record<string, StageProgress>;
  lastUpdatedISO: string;
}

// API response contracts
export interface BackendGameState {
  currentStageIndex: number; // 1..totalStages
  lastUpdatedISO?: string;
}

// API response contracts
export interface LoadGameResponse {
  state: BackendGameState;
}

export interface SaveGameResponse {
  state: BackendGameState;
  saved: boolean;
}

export interface UploadImageResponse {
  url: string;
}

// Centralized item catalogue and images (frontend assets)
export const DEFAULT_ITEM_ICON = 'img/plushie_neutral.PNG';

export enum ItemId {
  WoodPickaxe = 'wood_pickaxe',
  StonePickaxe = 'stone_pickaxe',
  IronPickaxe = 'iron_pickaxe',
  GoldPickaxe = 'gold_pickaxe',
  DiamondPickaxe = 'diamond_pickaxe',
  Map = 'map',
  Clock = 'clock',
  Compass = 'compass',
  Book = 'book',
  Shield = 'shield',
}

export const ITEM_DEFS: Record<ItemId, InventoryItemDef> = {
  [ItemId.WoodPickaxe]: {
    id: ItemId.WoodPickaxe,
    name: 'Holzspitzhacke',
    iconUrl: DEFAULT_ITEM_ICON,
  },
  [ItemId.StonePickaxe]: {
    id: ItemId.StonePickaxe,
    name: 'Steinspitzhacke',
    iconUrl: DEFAULT_ITEM_ICON,
  },
  [ItemId.IronPickaxe]: {
    id: ItemId.IronPickaxe,
    name: 'Eisenspitzhacke',
    iconUrl: DEFAULT_ITEM_ICON,
  },
  [ItemId.GoldPickaxe]: {
    id: ItemId.GoldPickaxe,
    name: 'Goldspitzhacke',
    iconUrl: DEFAULT_ITEM_ICON,
  },
  [ItemId.DiamondPickaxe]: {
    id: ItemId.DiamondPickaxe,
    name: 'Diamantspitzhacke',
    iconUrl: DEFAULT_ITEM_ICON,
  },
  [ItemId.Map]: { id: ItemId.Map, name: 'Karte', iconUrl: DEFAULT_ITEM_ICON },
  [ItemId.Clock]: { id: ItemId.Clock, name: 'Uhr', iconUrl: DEFAULT_ITEM_ICON },
  [ItemId.Compass]: { id: ItemId.Compass, name: 'Kompass', iconUrl: DEFAULT_ITEM_ICON },
  [ItemId.Book]: { id: ItemId.Book, name: 'Buch', iconUrl: DEFAULT_ITEM_ICON },
  [ItemId.Shield]: { id: ItemId.Shield, name: 'Schild', iconUrl: DEFAULT_ITEM_ICON },
};

export function getItemIconSrc(item?: Partial<InventoryItemDef> | null): string {
  if (!item) return DEFAULT_ITEM_ICON;
  if (item.iconUrl) return item.iconUrl;
  const byId = (ITEM_DEFS as any)[item.id as ItemId] as InventoryItemDef | undefined;
  return byId?.iconUrl || DEFAULT_ITEM_ICON;
}
