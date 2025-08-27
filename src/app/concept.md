Alles klar! Ich habe dein Skizzen-UI und die Beschreibung zu einem vollständigen, mobilen UI-Konzept verdichtet. Unten findest du: (1) extrahierte Anforderungen, (2) Architektur & Flow, (3) Layout & Responsiveness, (4) Komponenten, (5) Style-Guide, (6) Barrierefreiheit, (7) Datenmodell als TypeScript-Interfaces, (8) Logik (Timer, Inventar, Validierung, Persistenz) und (9) QA-/Edge-Cases.

---

# 1) Explizite & implizite Anforderungen (aus dem Briefing extrahiert)

**Kernidee**

- Text-Adventure im Minecraft-Universum.
- Ein NPC begleitet das Spiel; man „redet“ die ganze Zeit mit ihm (Speech-Bubble).
- Pro Stage (mehr als 9) ist ein Item zu erspielen. Itembild + Name werden prominent oben angezeigt.
- Antworten auf Fragen des NPC im Eingabefeld unter der Bubble; Antworttypen variieren.
- Jede Stage fordert zusätzlich **ein Bild-Upload** (Pflicht).
- Bei korrekter Antwort erhält der/die Spielende das Item; es erscheint in der **Inventarleiste** (Hotbar, 9 Slots).
- Ab **10 Items**: rechtester Slot zeigt **„+X“** statt Item 9 (X = Anzahl zusätzlicher Items).
- Anzeige der aktuellen Stage **links oben**: `<current>/<total>`.
- **Countdown-Timer** **rechts oben** bis **30.09.2025** (dd\:hh\:mm\:ss).
- Der NPC steht **links** (kleines Bild/Avatar); die **Speech-Bubble** ist ein **vertikal scrollbarer Container**.
- Es soll eine **Upload-Stelle** (Modal/Popup oder Bereich in der Ansicht) geben, die das Bild anzeigt.
- **Responsiv**: primär Mobile, aber auch Desktop gut nutzbar.

**Implizite Anforderungen**

- Fortschritt speichern (z. B. LocalStorage/Backend).
- Validierung der Antworten (verschiedene Datentypen).
- Fehlermeldungen/Hinweise, Retry-Möglichkeiten.
- Barrierefreiheit (Lesbarkeit, Tastaturbedienung, Screenreader-Texte).
- Performance (leichte Assets, Bildkompression).
- Theming angelehnt, aber nicht 1:1 Minecraft-Assets (Urheberrecht).

---

# 2) Informationsarchitektur & Spielzustände

**Seiten/Views**

- **GameView** (Hauptansicht): Header (Stage/Timer), Item-Hero, NPC+Dialog, Eingabe, Upload, Hotbar.
- **UploadModal**: Pflicht-Upload pro Stage (Preview, Replace, Remove).
- **Result/Hinweis Toasts**: „Richtig“, „Falsch“, „Upload fehlt“, „Timer abgelaufen“.
- **Final Screen**: bei Timer-Ende oder wenn alle Stages abgeschlossen.

**Zustände (vereinfacht)**

- `idle` → `awaiting_input` → `validating` → (`correct` → `reward_item`) / (`wrong` → `hint`/`retry`) → `advance_stage`.
- Global: `countdown_active`/`expired`.

---

# 3) Interaktionsfluss je Stage (Happy Path)

1. **Header** zeigt `3/24` links, Countdown rechts.
2. **Item-Hero** (Bild + Itemname) der aktuellen Stage sichtbar.
3. **NPC-Bubble** führt Story + Frage ein (scrollbar; optional Tipp-Button).
4. **Upload-Reminder** (kleiner Badge/Link in der Eingabesektion) → Klick öffnet **UploadModal** (Datei ziehen/auswählen, sofortige Vorschau).
5. **Eingabe** (je nach Typ: Text/Nummer/Choice/Boolean/…) + **Senden**.
6. **Validierung**; bei Erfolg: „Richtig!“ + **Inventar-Update**; Hotbar animiert (Slot füllt sich / +X steigt).
7. **Auto-Scroll** der Bubble zur nächsten Passage; **Stage++**.

---

# 4) Layout & Responsiveness (Mobile-first)

**Mobile (<768px)**

- **Header (fixed/sticky)**: links `X/Total`, mittig optional Logo klein, rechts Countdown.
- **Item-Hero**: zentriertes quadratisches Bild (max-Breite \~70vw), darunter Item-Name (H2).
- **Dialogbereich**: NPC-Avatar als runder (oder pixeliger) 56–72px Avatar links oberhalb der Bubble. **Speech-Bubble** füllt die Breite, **max-Höhe \~40–50vh**, **scrollbar**.
- **Input-Bereich**: dynamisches Formular + **„Antwort prüfen“** Button (full-width); daneben/unterhalb **„Bild hochladen“** (Icon-Button + Status „1 Bild hinzugefügt“).
- **Hotbar (sticky bottom, safe-area aware)**: 9 Slots (48–56px), mittig. Bei Tastatur-auf: verschiebt sich oberhalb der Tastatur (Viewport-safe-area).
- **UploadModal**: Full-screen Sheet von unten.

**Tablet (≥768px)**

- **Zweispaltig**: Links 280–320px **NPC-Spalte** (Avatar groß, kurze Bio/Hinweis), rechts der Rest (Item-Hero, Bubble, Input).
- **Hotbar** bleibt bottom sticky; Slots \~64px.

**Desktop (≥1024px)**

- **Grid 12**:

  - **Col 3**: NPC-Panel (Avatar, Name, „Sprecher“).
  - **Col 9**: Item-Hero (oben), darunter Bubble (größer), dann Input+Upload.

- **Hotbar**: floating bottom-centered (72px Slots), Schatten/Glas-Effekt.
- **Optionale „Inventar öffnen“-Overlay** beim Klicken auf **+X** (Grid aller Items).

---

# 5) Komponenten (UI-Bausteine & Props)

- **Header**
  Props: `{ currentStage, totalStages, deadline }`
  Verhalten: Countdown tickt sekündlich, Format `dd:hh:mm:ss`. Bei Ablauf: feuert `onExpire()`.

- **ItemHero**
  `{ imageUrl, name }` – quadratisches Bild (object-fit: contain), Name darunter.

- **NpcPanel**
  `{ avatarUrl, name, mood? }` – optionale Stimmungs-Icon/Border-Farbe.

- **SpeechBubble**
  `{ messages: DialogChunk[], onEnd?: fn }` – eigener Scrollcontainer, „neue Nachricht“-Auto-Scroll, optional Schreibmaschinen-Effekt (abschaltbar).

- **StageForm**
  `{ inputSchema: QuestionInput, onSubmit(answer), uploadStatus }` – rendert dynamisch:
  `text | number | choice (single/multi) | boolean | date | time | coordinate | code | regex` (erweitern möglich).
  Validierung inline; Enter-Key Support; „Senden“ disabled bis Upload erfüllt.

- **UploadBadge / UploadButton**
  `{ required: true, files: UploadedFile[], onOpenModal }` – zeigt Status, Dateiname, Größe.

- **UploadModal**
  `{ accept, maxSizeMB, previewUrl, onSave(file) }` – Crop optional; Kompression client-seitig empfohlen.

- **Hotbar**
  `{ items: InventoryItem[], maxSlots: 9 }` – zeigt Items in Reihenfolge der Errungenschaft; ab 10: Slot 9 = `+X`; Klick auf `+X` → InventoryOverlay.

- **InventoryOverlay** (optional)
  `{ items }` – Vollbildliste; mobile: Sheet.

- **Toast/Status**
  Erfolg/Fehler/Hinweis.

---

# 6) Style-Guide (Minecraft-angehaucht, modern & performant)

**Farben (CSS-Variablen)**

- `--bg`: #0f1115 (dunkles Grau/Anthrazit)
- `--panel`: #1a1f29
- `--text`: #e6e6e6
- `--muted`: #a8b0bf
- **Akzente inspiriert von Minecraft** (ohne Original-Assets):

  - `--grass`: #3ba55c
  - `--dirt`: #7a4f2b
  - `--stone`: #8a8f98
  - `--gold`: #d4af37
  - `--error`: #ff5a5a
  - `--success`: #61d095

**Typografie**

- Headline: „Press Start 2P“ / „Minecraftia“-ähnlich (pixelig) **nur für Titel/Itemnamen** in moderater Größe (Lesbarkeit!).
- Fließtext/UI: „Inter“, „Nunito“ oder „Rubik“ (400/600).
- Zahlen (Timer): Tabular Lining (`font-variant-numeric: tabular-nums`).

**Abstände & Ecken**

- 8-pt Grid (4/8/16/24/32).
- Ecken: `border-radius: 10px` (UI) — **Hotbar** leicht pixelig: `4px`.

**Effekte**

- Leichte **Inner-Shadow** auf Hotbar-Slots (Voxel-Gefühl).
- **Hover**: subtile Scale 1.02 + Schatten.
- **Focus**: 2px Outline `--gold` (AA-konform).
- **Transitions**: 150–200ms.

**Icons**

- Linie-Icons (z. B. Lucide/Phosphor). Upload, Senden (Paperplane), Check, X.

**Motion**

- SpeechBubble: optional „typewriter“ (50–30ms/char), abschaltbar.
- Item-Gewinn: Slot blinkt kurz in `--gold`, dann Ruhe.

---

# 7) Barrierefreiheit (A11y)

- Kontraste ≥ 4.5:1 (Text), ≥ 3:1 (Large Text/UI).
- ARIA-Labels: Timer (`role="timer"`), Hotbar (`role="listbox"`), Slots (`role="option"`), Upload (`aria-describedby` mit Dateikriterien).
- Tastaturbedienung: Tab-Reihenfolge, `Enter` sendet, `Esc` schließt Modal, Pfeile navigieren Hotbar.
- Screenreader-Texte: „Stage 3 von 24, noch 12 Tage…“, „+3 weitere Items“.
- Animations-Respekt: `prefers-reduced-motion`.
- Fehlertexte programmatisch verbunden (aria-invalid, aria-errormessage).

---

# 8) Datenmodell (TypeScript)

```ts
// Globale Spielkonfiguration
export interface GameConfig {
  totalStages: number;
  deadlineISO: string; // "2025-09-30T21:59:59.000Z" (UTC!)
  hotbarSlots: number; // 9
}

// Inventar/Item
export interface InventoryItemDef {
  id: string; // "iron_pickaxe"
  name: string; // "Eisenspitzhacke"
  iconUrl: string; // CDN/Asset
}

// Dialog
export interface DialogChunk {
  id: string;
  text: string; // Richtext optional (Markdown/BBCode)
  mood?: 'neutral' | 'happy' | 'worried' | 'angry';
  delayMs?: number; // für Typewriter/Auto-Advance
}

// Eingabetypen
export type QuestionInput =
  | {
      kind: 'text';
      placeholder?: string;
      minLength?: number;
      maxLength?: number;
      caseSensitive?: boolean;
      pattern?: string;
    } // pattern = RegExp source
  | { kind: 'number'; min?: number; max?: number; step?: number; integerOnly?: boolean }
  | { kind: 'choice'; multiple?: boolean; options: { id: string; label: string; value: string }[] }
  | { kind: 'boolean'; trueLabel?: string; falseLabel?: string }
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
  | { kind: 'regex'; description?: string }; // Spieler*in gibt ein Regex ein

// Korrektheitsprüfung (datengetrieben)
export type AnswerCheck =
  | { mode: 'exact'; expected: string | number | string[] | boolean; caseSensitive?: boolean }
  | { mode: 'anyOf'; expected: Array<string | number> }
  | { mode: 'range'; min?: number; max?: number }
  | { mode: 'regex'; pattern: string; flags?: string } // testet Spieler-Input
  | { mode: 'coordinateWithin'; rect: { minX: number; maxX: number; minY: number; maxY: number } };

// Upload-Anforderung pro Stage
export interface UploadRequirement {
  required: boolean;
  acceptMime: string[]; // ["image/png","image/jpeg"]
  maxSizeMB: number; // z.B. 5
  instructions?: string; // kurz im Modal anzeigen
}

// Eine Stage
export interface Stage {
  id: string; // "stage-03"
  index: number; // 1-basiert
  item: InventoryItemDef; // Belohnung
  title?: string; // optionaler Story-Titel
  npcDialog: DialogChunk[]; // Story + Frage
  question: {
    prompt: string;
    input: QuestionInput;
    /** Optional: Bei 'uploadOnly' Stages gibt es keine Antwortvalidierung. */
    check?: AnswerCheck;
    triesAllowed?: number; // default: unlimited
    hintAfterTries?: number; // z.B. nach 2 Versuchen Tipp anzeigen
    hintText?: string;
  };
  upload: UploadRequirement;
  assets?: { itemImage?: string; background?: string };
}

// Laufzeitstatus
export interface UploadedFile {
  id: string;
  fileName: string;
  mime: string;
  size: number;
  url: string; // blob/object URL oder CDN
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
  inventory: InventoryItemDef[]; // Reihenfolge des Gewinns
  progress: Record<string, StageProgress>;
  lastUpdatedISO: string;
}
```

---

# 9) Logik & Verhalten

## Countdown-Timer (bis 30.09.2025)

- Quelle: `deadlineISO` (UTC). Client berechnet `remaining = deadline - now`.
- Formatierung **dd\:hh\:mm\:ss**

  - `days = floor(ms/86400000)`
  - `hours = floor((ms%86400000)/3600000)` etc., **zweistellig** (`String.padStart(2,"0")`).

- **Tick** 1s via `requestAnimationFrame` + Drift-Korrektur (Differenz zum echten `now`).
- Bei `remaining <= 0`:

  - Eingaben disabled, Upload disabled.
  - Final Screen: „Zeit abgelaufen“ + Liste erlangter Items.

## Hotbar & „+X“-Regel

- `visibleSlots = min(inventory.length, 8)`
- Wenn `inventory.length <= 9`: zeige alle.
- Wenn `inventory.length >= 10`:

  - Slots 1..8 = Items 1..8, Slot 9 = **+X**, wobei `X = inventory.length - 8`.
  - **Tooltip/Overlay** auf `+X`: vollständiges Inventar anzeigen.

## Validierung & Antwortprüfung

- Client-seitig gegen `AnswerCheck` (datengetrieben).
- „Falsch“ → Fehlertoast + optional `hintText` nach `hintAfterTries`.
- „Richtig“ →

  - **Upload vorhanden?** Wenn **nein**, blockiere Fortschritt mit Hinweis „Bitte Bild hochladen“.
  - Wenn **ja**: Inventar ergänzen, Stage als `completed`.

- **Upload**: MIME + Größe prüfen; bei Erfolg Thumbnail anzeigen.
- **Persistenz**: `localStorage` (Key: `mc-textadv-state`); optional Sync auf Backend.

## Typische Fehlzustände

- Timer abgelaufen: alles read-only.
- Offline: weiter spielbar, Uploads als Blobs vorhalten; Sync später.
- Bild zu groß/falsch: klare Meldung + Tipps.

---

# 10) QA-/Edge-Cases & Akzeptanzkriterien

**Akzeptanzkriterien**

- Header zeigt **korrekte Stage und Gesamtzahl**; Countdown stimmt auf ±1s.
- Item-Hero zeigt **Bild + Namen** der **aktuellen Stage**.
- Speech-Bubble **scrollt** (Touch + Wheel) und **autoscrollt** bei neuen Nachrichten.
- Formular rendert **korrekten Eingabetyp**; Enter sendet (wo sinnvoll).
- **Upload ist Pflicht**: ohne Upload kein Stage-Abschluss.
- Bei korrekter Antwort + vorhandenem Upload:

  - Item erscheint in Hotbar; ab dem 10. Item `+X` sichtbar mit korrekter Zahl.

- **Responsive**:

  - Mobile: kein horizontaler Scroll, Hotbar nie durch Tastatur verdeckt, alles mit Daumen erreichbar.
  - Desktop: HOchskaliertes und Verhältnisangepasste Ansicht, strukturell genau wie mobile

- **A11y**: Fokusreihenfolge sinnvoll, Screenreader-Labels vorhanden, Kontrast geprüft.

**Edge-Cases**

- Benutzer\*in überspringt Upload → Stage bleibt „offen“.
- Mehrfachversuche mit variierenden Typen (z. B. `number` mit Dezimal/Komma) → Normalisierung (`,` → `.`).
- Sehr lange NPC-Texte → Bubble mit „Scroll to Bottom“-Button.
- Sehr viele Items (>24) → InventoryOverlay paginiert.
- Asset-Ausfall (Itembild 404) → Platzhalter-Sprite.

---

Wenn du möchtest, kann ich dir auf Basis dieses Konzepts direkt ein **React/Tailwind-Skeleton** (Header, Hero, Bubble, Form, Upload-Modal, Hotbar inkl. `+X`) erstellen – inklusive der obigen Interfaces und einer Beispiel-Stage.
