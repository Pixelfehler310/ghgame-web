import { Stage } from '../../models/game.models';

// Helper to convert item names to lowercase underscore keys
const toKey = (name: string) => 'item/' + name.toLowerCase().replace(/\s+/g, '_');

export const STAGES_DATA: Stage[] = [
  {
    id: 'stage-01',
    index: 1,
    item: {
      id: toKey('Oak Leaves'),
      name: 'Oak Leaves',
      iconUrl: `/img/${toKey('Oak Leaves')}.png`,
    },
    title: 'Parque Eduardo VII',
    locationName: 'Parque Eduardo VII',
    npcDialog: [
      {
        id: 'd1',
        text: `Welcher autistische Builder hat denn hier seinen "Garten" gebaut… Junge sieht das crazy aus… Könnte man sich fast drin verlaufen… Was glaubst du, wenn das mit quadratischen Leave Blöcken gebaut wurde, wie viele Blöcke sind dann jeweils maximal direkt anliegend nebeneinander platziert, wenn du in Richtung Säule schaust?`,
      },
    ],
    question: {
      prompt: 'Gib die korrekte Anzahl der Blöcke ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 4 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Oak Leaves')}.png` },
    mapUrl: 'http://example.com/image/0',
  },
  {
    id: 'stage-02',
    index: 2,
    item: {
      id: toKey('Honey Bottle'),
      name: 'Honey Bottle',
      iconUrl: `/img/${toKey('Honey Bottle')}.png`,
    },
    title: 'Biene LX Factory',
    locationName: 'Biene LX Factory',
    npcDialog: [
      {
        id: 'd1',
        text: `Hier im riesigen Kunst Areal der LX Factory hab ich öfters mal ein paar Bienchen rumfliegen sehen. Wenn du es schafft sie zu streicheln ohne gestochen zu werden, gibt sie dir ja vielleicht etwas Honig… Wenn du ein Beweisbild machst, gebe ich dir eine ganze Flasche!`,
      },
    ],
    question: {
      prompt: 'Lade ein Beweisfoto hoch.',
      input: { kind: 'uploadOnly' },
    },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Honey Bottle')}.png` },
    mapUrl: 'http://example.com/image/1',
  },
  {
    id: 'stage-03',
    index: 3,
    item: { id: toKey('Elytra'), name: 'Elytra', iconUrl: `/img/${toKey('Elytra')}.png` },
    title: 'Bücherei Le Devagar Fahrrad',
    locationName: 'Bücherei Le Devagar Fahrrad',
    npcDialog: [
      {
        id: 'd1',
        text: `Achtung, Achtung! Nicht erschrecken: In diesem Möchte-Gern-Stronghold wohnt ein etwas zurückgebliebener Villager, der seine Elytra auf eine seeeehr unkonventionelle Weise benutzt… naja… kannst du zumindest erkennen welche Farbe seine Elytra hat?`,
      },
    ],
    question: {
      prompt: 'Wähle die richtige Option.',
      input: {
        kind: 'choice',
        options: [
          { id: 'o1', label: 'beige', value: 'beige' },
          { id: 'o2', label: 'lila', value: 'lila' },
          { id: 'o3', label: 'weiß', value: 'weiß' },
        ],
      },
      check: { mode: 'exact', expected: 'beige' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Elytra')}.png` },
    mapUrl: 'http://example.com/image/2',
  },
  {
    id: 'stage-04',
    index: 4,
    item: {
      id: toKey('Glass Pane'),
      name: 'Glass Pane',
      iconUrl: `/img/${toKey('Glass Pane')}.png`,
    },
    title: 'Village Underground',
    locationName: 'Village Underground',
    npcDialog: [
      {
        id: 'd1',
        text: `Okayyy… das muss wieder ein sehhhr verrückter Craft Attack Build sein. Absolut trippy. Warum baut man einen Bus, um ihn dann auf einen Container zu stellen hahahah!? Ist das überhaupt akkurat? Wie viele Fenster, die jeweils in einen schwarzen Rahmen gefasst sind, hat der eine Bus überhaupt (ohne Türen)?`,
      },
    ],
    question: {
      prompt: 'Zähle die Fenster und gib die Zahl ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 31 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Glass Pane')}.png` },
    mapUrl: 'http://example.com/image/6',
  },
  {
    id: 'stage-05',
    index: 5,
    item: {
      id: toKey('Stone Sword'),
      name: 'Stone Sword',
      iconUrl: `/img/${toKey('Stone Sword')}.png`,
    },
    title: 'PADRÃO Dos Descobrimentos',
    locationName: 'PADRÃO Dos Descobrimentos',
    npcDialog: [
      {
        id: 'd1',
        text: `Unseres heutigen Wissenstandes nach, wurden die Villager mit der Evolution immer kleiner und keiner und mit ihnen auch ihre Tools. Hier ist ein antikes Überbleibsel unserer Vorfahren. Da sind wohl einige modernere Villager so schockiert gewesen, dass sie ebenfalls zu Stein erstarrt sind. Was hält denn der oberste von ihnen in der Hand?`,
      },
    ],
    question: {
      prompt: 'Wähle die richtige Option.',
      input: {
        kind: 'choice',
        options: [
          { id: 'o1', label: 'Schale', value: 'Schale' },
          { id: 'o2', label: 'Baby', value: 'Baby' },
          { id: 'o3', label: 'Schiff', value: 'Schiff' },
        ],
      },
      check: { mode: 'exact', expected: 'Schiff' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Stone Sword')}.png` },
    mapUrl: 'http://example.com/image/7',
  },
  {
    id: 'stage-06',
    index: 6,
    item: { id: toKey('Boat'), name: 'Boat', iconUrl: `/img/${toKey('Boat')}.png` },
    title: 'Promenade',
    locationName: 'Promenade',
    npcDialog: [
      {
        id: 'd1',
        text: `So jetzt lass uns schnell über den Ocean traveln, schnapp dir ein Boot und los gehts. Der Hafen hier ist so fett, hier steht safe eins rum, was dir passt. Mach ein Bild von einem Boot, das du willst und ich bau es dir nach, kein Ding!`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Boat')}.png` },
    mapUrl: 'http://example.com/image/8',
  },
  {
    id: 'stage-07',
    index: 7,
    item: {
      id: toKey('Birch Sapling'),
      name: 'Birch Sapling',
      iconUrl: `/img/${toKey('Birch Sapling')}.png`,
    },
    title: 'Green Street',
    locationName: 'Green Street',
    npcDialog: [
      {
        id: 'd1',
        text: `Wow, hier hat wohl irgendein Spieler mal schnell sein Inventar ausgemüllt und vergessen die ganzen Saplings vorher anzuzünden… Kein Wunder, dass es dann so aussieht, einfach ein halbes Biom erschaffen. Kannst du eine der Pflanzen identifizieren? Im Gegenzug drop ich dir dann meinen Inventar-Müll, aka. Birken Setzlinge, haha.`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Birch Sapling')}.png` },
    mapUrl: 'http://example.com/image/9',
  },
  {
    id: 'stage-08',
    index: 8,
    item: { id: toKey('Diamond'), name: 'Diamond', iconUrl: `/img/${toKey('Diamond')}.png` },
    title: 'Bordallo 2 Fuchs',
    locationName: 'Bordallo 2 Fuchs',
    npcDialog: [
      {
        id: 'd1',
        text: `Die Tiere hier zerstören mir jedes Mal den Run. Vorallem die Füchse, die sich die Items klauen, wenn du nur eine Sekunde unaufmerksam bist und was liegen lässt. Einer von denen hat mir einfach mal nen Diamant geklaut… also falls du mal einen brauchen solltest, am besten suchst du dort… Manchmal lassen sie ein Item los, wenn man sie mit etwas leckerem zu essen lockt… Mach ein Bild, ich hoffe du schaffst es einen zu zähmen!`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Diamond')}.png` },
    mapUrl: 'http://example.com/image/10',
  },
  {
    id: 'stage-09',
    index: 9,
    item: { id: toKey('Apple'), name: 'Apple', iconUrl: `/img/${toKey('Apple')}.png` },
    title: 'Mercado de Ribeira',
    locationName: 'Mercado de Ribeira',
    npcDialog: [
      {
        id: 'd1',
        text: `Challenge: Riesengroßer Markt, Handelsmöglichkeiten weit und breit, aber keine Emeralds in der Tasche… Schaff einen Apfel heran und stärke dich mit Beweisbild!`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Apple')}.png` },
    mapUrl: 'http://example.com/image/11',
  },
  {
    id: 'stage-10',
    index: 10,
    item: {
      id: toKey('Pink Concrete'),
      name: 'Pink Concrete',
      iconUrl: `/img/${toKey('Pink Concrete')}.png`,
    },
    title: 'Pink Street Tunnel',
    locationName: 'Pink Street Tunnel',
    npcDialog: [
      {
        id: 'd1',
        text: `Was ist denn hier passiert, war da irgend jemand farbenblind als er diesen Weg gebaut hat? Wenn ein Block ein Schritt ist, wie viele Pink Concrete Blöcke ist der Weg dann wohl breit?`,
      },
    ],
    question: {
      prompt: 'Wähle die richtige Option.',
      input: {
        kind: 'choice',
        options: [
          { id: 'o1', label: '2 Blöcke', value: '2' },
          { id: 'o2', label: '4 Blöcke', value: '4' },
          { id: 'o3', label: '6 Blöcke', value: '6' },
        ],
      },
      check: { mode: 'exact', expected: '6' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Pink Concrete')}.png` },
    mapUrl: 'http://example.com/image/12',
  },
  {
    id: 'stage-11',
    index: 11,
    item: {
      id: toKey('Copper Ingot'),
      name: 'Copper Ingot',
      iconUrl: `/img/${toKey('Copper Ingot')}.png`,
    },
    title: 'La Brasiliera',
    locationName: 'La Brasiliera',
    npcDialog: [
      {
        id: 'd1',
        text: `Die Legende besagt, dieser Villager hat so viele Zombies getötet und sein Dorf besser beschützt als jeder Eisengolem, dass die Bewohner ihn aus Kupfer nachgebaut haben. Wie hieß der Typ nochmal genau?`,
      },
    ],
    question: {
      prompt: 'Gib den Namen ein.',
      input: { kind: 'text', placeholder: 'Name…' },
      check: { mode: 'regex', pattern: '^\\s*fernando\\s+pessoa\\s*$', flags: 'i' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Copper Ingot')}.png` },
    mapUrl: 'http://example.com/image/13',
  },
  {
    id: 'stage-12',
    index: 12,
    item: { id: toKey('Rail'), name: 'Rail', iconUrl: `/img/${toKey('Rail')}.png` },
    title: 'Fabrica de Nata',
    locationName: 'Fabrica de Nata',
    npcDialog: [
      {
        id: 'd1',
        text: `Ich sags dir: OP Gaps sind in Lissabon echt overrated… Gönn dir die Dinger hier! Aber irgendwas ist hier wirklich komisch. Was fährt da bitte auf den Schienen?`,
      },
    ],
    question: {
      prompt: 'Wähle die richtige Option.',
      input: {
        kind: 'choice',
        options: [
          { id: 'o1', label: 'Nata Gebäck', value: 'Nata Gebäck' },
          { id: 'o2', label: 'Züge', value: 'Züge' },
          { id: 'o3', label: 'Teddys', value: 'Teddys' },
          { id: 'o4', label: 'Spielzeugautos', value: 'Spielzeugautos' },
        ],
      },
      check: { mode: 'exact', expected: 'Nata Gebäck' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Rail')}.png` },
    mapUrl: 'http://example.com/image/14',
  },
  {
    id: 'stage-13',
    index: 13,
    item: { id: toKey('Lore'), name: 'Lore', iconUrl: `/img/${toKey('Lore')}.png` },
    title: 'Line 28/…',
    locationName: 'Line 28/…',
    npcDialog: [
      {
        id: 'd1',
        text: `Also Elytra, sag ich dir ehrlich, vollkommen 1.21, übel outdated. Der heiße Shit sind gerade diese nicen gelben Bahnen hier. Das musst du unbedingt ausprobieren! Schick mir als Beweis dein Ticket.`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Lore')}.png` },
    mapUrl: 'http://example.com/image/15',
  },
  {
    id: 'stage-14',
    index: 14,
    item: {
      id: toKey('Diorite Wall'),
      name: 'Diorite Wall',
      iconUrl: `/img/${toKey('Diorite Wall')}.png`,
    },
    title: 'Sao Vicente de Fora Kloster',
    locationName: 'Sao Vicente de Fora Kloster',
    npcDialog: [
      {
        id: 'd1',
        text: `Diese geile Festung hab ich mir letztens auf Fiver gekauft. Was glaubst du, ist es die Bestellung für 100€, 300€ oder 500€? PS: Finde heraus wie viele Diorit Mauern zwischen den beiden hohen Türmen verbaut sind, dann weißt du welche. Denk dran: eine Mauer geht immer von Säule zu Säule…`,
      },
    ],
    question: {
      prompt: 'Gib die Anzahl der Mauern ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 3 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Diorite Wall')}.png` },
    mapUrl: 'http://example.com/image/16',
  },
  {
    id: 'stage-15',
    index: 15,
    item: { id: toKey('Vines'), name: 'Vines', iconUrl: `/img/${toKey('Vines')}.png` },
    title: 'Bemalter Tunnel',
    locationName: 'Bemalter Tunnel',
    npcDialog: [
      {
        id: 'd1',
        text: `WOW! Ein random Urwald mitten in der Stadt? Bei der wievielten Stufe von unten kommt der Baum, an dem die Vines wachsen, auf der rechten Seite aus dem Boden?`,
      },
    ],
    question: {
      prompt: 'Gib die Stufe ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 4 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Vines')}.png` },
    mapUrl: 'http://example.com/image/17',
  },
  {
    id: 'stage-16',
    index: 16,
    item: { id: toKey('Banner'), name: 'Banner', iconUrl: `/img/${toKey('Banner')}.png` },
    title: 'Largo do intendente Haus',
    locationName: 'Largo do intendente Haus',
    npcDialog: [
      {
        id: 'd1',
        text: `Hmmm, heftige Banner… aber das MUSS eigentlich die 100€ Bestellung sein, oder? Also komm… Banner? Ja okay, ist heftig, aber das dauert jetzt halt auch echt nicht so lang. Aber ich muss sagen, der Banner unten links ist schon wiiiiirklich geil, was steht da nochmal?`,
      },
    ],
    question: {
      prompt: 'Gib den Text vom Banner ein.',
      input: { kind: 'text', placeholder: 'Text…' },
      check: {
        mode: 'regex',
        pattern: '^\\s*fabrica\\s+de\\s+loica\\s+de\\s+antonio\\s+do\\s+costa\\s+lamego\\s*$',
        flags: 'i',
      },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Banner')}.png` },
    mapUrl: 'http://example.com/image/18',
  },
  {
    id: 'stage-17',
    index: 17,
    item: {
      id: toKey('Music Disc'),
      name: 'Music Disc',
      iconUrl: `/img/${toKey('Music Disc')}.png`,
    },
    title: 'Fiera da ladra',
    locationName: 'Fiera da ladra',
    npcDialog: [
      {
        id: 'd1',
        text: `Der Fiera da Ladra ist auch bekannt als "Markt der Diebe". Da ist es ja klar, dass jegliche Endermen hier ihre geklauten Items versuchen zu verticken. Vielleicht kommst du hier ja mit etwas Glück an eine der seltenen Music Discs? Wenn du eine schöne Schallpatte gefunden hast, Mach ein Bild!`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Music Disc')}.png` },
    mapUrl: 'http://example.com/image/19',
  },
  {
    id: 'stage-18',
    index: 18,
    item: {
      id: toKey('Purpur Block'),
      name: 'Purpur Block',
      iconUrl: `/img/${toKey('Purpur Block')}.png`,
    },
    title: 'Tile Wall fiera da ladra',
    locationName: 'Tile Wall fiera da ladra',
    npcDialog: [
      {
        id: 'd1',
        text: `Um sich vor den ganzen Diebstählen der Endermen zu schützen, haben die Villager vor geraumer Zeit hier eine geheime Botschaft auf den Purpur Blöcken platziert. Was besagt diese Botschaft auf deutsch?`,
      },
    ],
    question: {
      prompt: 'Gib die Botschaft ein.',
      input: { kind: 'text', placeholder: 'Antwort…' },
      check: { mode: 'regex', pattern: '^\\s*das\\s+leben\\s+ist\\s+schön\\s*$', flags: 'i' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Purpur Block')}.png` },
    mapUrl: 'http://example.com/image/20',
  },
  {
    id: 'stage-19',
    index: 19,
    item: { id: toKey('Peony'), name: 'Peony', iconUrl: `/img/${toKey('Peony')}.png` },
    title: 'Casa Sao Miguel',
    locationName: 'Casa Sao Miguel',
    npcDialog: [
      {
        id: 'd1',
        text: `Oh ist habe ich irgendwie ein neues Update verpasst? So eine Art von Dorf Haus hab ich noch nie gesehen. Ist ja echt süß und es riecht so gut! Wie viele Rosen hängen hier bitte im Haus?`,
      },
    ],
    question: {
      prompt: 'Gib die Anzahl der Rosen ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 16 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Peony')}.png` },
    mapUrl: 'http://example.com/image/21',
  },
  {
    id: 'stage-20',
    index: 20,
    item: {
      id: toKey('Resin Brick Slab'),
      name: 'Resin Brick Slab',
      iconUrl: `/img/${toKey('Resin Brick Slab')}.png`,
    },
    title: 'Miradouro de Santa Luzia',
    locationName: 'Miradouro de Santa Luzia',
    npcDialog: [
      {
        id: 'd1',
        text: `Ich weiß, der Timer läuft, aber hier könnte ich wirklich unendlich lange chillen. Diese View ist einfach heftig. Was für ein Gewässer ist das wohl, auf das du schaust? Es ist weder ein Warm Ocean, noch ein Cold Ocean, das würde ich definitiv erkennen…`,
      },
    ],
    question: {
      prompt: 'Gib den Namen des Gewässers ein.',
      input: { kind: 'text', placeholder: 'z. B. Tejo' },
      check: { mode: 'regex', pattern: '(?:^|\\b)(tajo|tejo)(?:\\b|$)', flags: 'i' },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Resin Brick Slab')}.png` },
    mapUrl: 'http://example.com/image/22',
  },
  {
    id: 'stage-21',
    index: 21,
    item: { id: toKey('Bone Meal'), name: 'Bone Meal', iconUrl: `/img/${toKey('Bone Meal')}.png` },
    title: 'Flower Wall Museum saint anthony',
    locationName: 'Flower Wall Museum saint anthony',
    npcDialog: [
      {
        id: 'd1',
        text: `Ein Villager-Bauer ist hier scheinbar komplett ausgerastet mit Bone Meal. Such dir einfach deine Lieblingsblume raus, mach ein Foto und dann kannst du dir mit dem Bone Meal deine eigene Blumenwand bauen.`,
      },
    ],
    question: { prompt: 'Lade ein Beweisfoto hoch.', input: { kind: 'uploadOnly' } },
    upload: { required: true, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Bone Meal')}.png` },
    mapUrl: 'http://example.com/image/3',
  },
  {
    id: 'stage-22',
    index: 22,
    item: {
      id: toKey('Quartz Pillar'),
      name: 'Quartz Pillar',
      iconUrl: `/img/${toKey('Quartz Pillar')}.png`,
    },
    title: 'Arco da Rua augusta',
    locationName: 'Arco da Rua augusta',
    npcDialog: [
      {
        id: 'd1',
        text: `Ok… das MUSS jetzt aber wirklich die 500€ Bestellung sein. Holy moly!!! Jungs, wie habt ihr das gebaut, heftig!!! Zähl mal die Quartz-Säulen des Arcs, das sind sooo viele!`,
      },
    ],
    question: {
      prompt: 'Gib die Anzahl der Säulen ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 6 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Quartz Pillar')}.png` },
    mapUrl: 'http://example.com/image/4',
  },
  {
    id: 'stage-23',
    index: 23,
    item: {
      id: toKey('Acacia Door'),
      name: 'Acacia Door',
      iconUrl: `/img/${toKey('Acacia Door')}.png`,
    },
    title: 'Tür Abel Pereira da Fonseca',
    locationName: 'Tür Abel Pereira da Fonseca',
    npcDialog: [
      {
        id: 'd1',
        text: `Dieses Gebäude fand ich schon immer suspekt, das ist safe eine versteckte XP-Farm. Kann uns aber auch egal sein. Schließlich brauchst du ja nur dein die Tür. Am besten du schaust dir die ganz rechte Tür an: Wie viele symmetrische, rechteckige einzelne, leere(!) Fensterchen hat diese Tür? PS: direkt rechts neben der Tür ist der Eingang zu Marvila 8, mein absoluter Geheimtipp in Lissabon, wenn es um einzigartige Locations geht. Schau definitiv mal rein!`,
      },
    ],
    question: {
      prompt: 'Gib die Anzahl der Fensterchen ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 16 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Acacia Door')}.png` },
    mapUrl: 'http://example.com/image/5',
  },
  {
    id: 'stage-24',
    index: 24,
    item: {
      id: toKey('Light Blue Glazed Terracotta'),
      name: 'Light Blue Glazed Terracotta',
      iconUrl: `/img/${toKey('Light Blue Glazed Terracotta')}.png`,
    },
    title: 'Palace de Marquesses',
    locationName: 'Palace de Marquesses',
    npcDialog: [
      {
        id: 'd1',
        text: `Die stärksten PvPler unserer Zeit wurden hier verewigt. Leider hatten sie wohl doch zu wenig Pilz-Soups im Inventar und sind letztendlich doch zu früh von uns gegangen… Falls du dich fragst wieso mein Kopf da nicht hängt… naja, ich bin immer noch hier. Wie viele von ihnen sind dort eigentlich bei der blauen Wand innerhalb eines Bogens verewigt.`,
      },
    ],
    question: {
      prompt: 'Gib die Anzahl der Köpfe ein.',
      input: { kind: 'number', min: 0, step: 1, integerOnly: true },
      check: { mode: 'exact', expected: 15 },
    },
    upload: { required: false, acceptMime: ['image/png', 'image/jpeg'], maxSizeMB: 5 },
    assets: { itemImage: `/img/${toKey('Light Blue Glazed Terracotta')}.png` },
    mapUrl: 'http://example.com/image/23',
  },
];

export default STAGES_DATA;
