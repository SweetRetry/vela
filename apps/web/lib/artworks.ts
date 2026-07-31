export type ArtworkMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string; duration?: string }

export type Artwork = {
  id: string
  slug: string
  title: string
  englishTitle: string
  time: string
  dimensions: string
  summary: string
  originalPrompt: string
  /** 画面主色调，决定叠加在作品上的文字与控件用墨黑还是暖白 */
  tone: "light" | "dark"
  /** 所属系列；缺省时索引按介质分区 */
  series?: string
  media: ArtworkMedia
}

export const artworks = [
  {
    id: "001",
    slug: "unbound-bloom",
    title: "挣脱盛放",
    englishTitle: "UNBOUND BLOOM",
    time: "2026/07/31",
    dimensions: "3840 × 2160 px",
    summary: "从紧束的深绿根部向外爆发。花冠不是被摆放的静物，而是一股正在越过画框的生命冲动。",
    tone: "light",
    media: {
      kind: "image",
      src: "/works/unbound-bloom.webp",
      alt: "暖白背景上，一束珊瑚红、洋红与橙色花朵从深绿色茎叶中向外舒展",
    },
    originalPrompt: `## 平面核心

设计主轴：一束花像刚刚挣脱束缚的生命体，从紧束的根部向四周猛烈舒展；饱满花冠形成上升的火焰轮廓，一枝细长花茎越过整体节奏向右上方探出，成为充满生命冲动的记忆点。

画框模式：fixed composition，竖向画幅；花束占据约 90% 画面，从下方中央生长至顶部并让部分花瓣自然越出边缘，画面中的唯一具象主体是一整束花。

元素与图层：明亮暖白底面承托花束；深绿色茎叶连接所有花冠；大面积花瓣色块构成 dominant layer，少量细小花朵与卷曲叶片形成 support layer，透明叠色与花粉般的微小色点形成 surface layer。

## 构成系统

图形与尺度：一朵硕大的珊瑚红主花承担视觉中心，周围环绕洋红、橙红与玫粉色的中型花冠，细小亮黄花朵穿插其间；花束下部紧密收拢，上部急剧膨胀，形成由压缩到释放的强烈尺度变化。

网格与节奏：以束口为原点建立不对称放射结构，茎叶沿不同弧线向外喷薄；花冠从高密度中心逐渐过渡到轻盈边缘，大小交替、方向错落，视线从深色束口迅速冲向明亮主花，再沿越界花茎抵达右上方。

图像表现：花朵保留真实可辨的花瓣层次、自然卷曲和新鲜含水感，同时把整体轮廓压缩成鲜明、直接的大色块；边缘清晰有力，局部花瓣通过透明叠印产生新的色彩，不呈现静物摄影式的沉静摆放。

## 视觉表现

色彩与明度：高饱和珊瑚红、洋红与橙色占据主要面积，电光般的嫩绿色贯穿花束，少量亮黄集中在花蕊和细花上；暖白背景保持开阔，深绿束口提供唯一重暗部，使整束花呈现灼热、明亮、具有感染力的生命能量。

材质与表面：结合精细植物形态与丝网印刷质感，花瓣色块带有浓厚油墨覆盖、轻微套色偏移和局部半透明叠印；纸面仅保留细腻纤维，纹理集中在花冠交叠与色彩碰撞处，整体保持锐利、饱满、完成度极高。`,
  },
  {
    id: "002",
    slug: "rootless",
    title: "无根",
    englishTitle: "ROOTLESS",
    time: "2026/07/31",
    dimensions: "3840 × 2160 px",
    summary:
      "猛虎从上方压迫画面，武士以低姿态横棍迎击。暖棕、墨黑与局部朱红把空间压缩成一记正在爆发的水墨笔触。",
    tone: "dark",
    media: {
      kind: "image",
      src: "/works/rootless-tiger.webp",
      alt: "水墨飞溅的暖棕空间里，持棍武士背对画面，与上方扑压而来的巨虎对峙",
    },
    originalPrompt: `## 整体风格

东方写意水墨数字插画。以低饱和暖棕、黑白灰为主色调，局部使用朱红点缀。强烈的后方逆光，明暗对比鲜明。

## 巨大猛虎

占据画面上半部分，头部与前肢向下扑压，形成强烈压迫感。双眼泛着微弱红光，毛发狂暴扬起，如飞溅的水墨般向外迸散。

## 持棍武士

位于画面下方中央，以低姿态背对镜头站立。黑发与红色发带随气流扬起，身穿宽大、带撕裂感的白色长袍与朱红色袴裤，双手横握黑色长棍，迎面对抗猛虎。

## 场景氛围

画面布满飞溅的水墨粒子、粉尘碎屑与白色光点，整体动势斜向地面。背景是虚化、空旷的棕灰色空间。

## 镜头与构图

9:16 竖幅，极低视角仰拍，采用具有强烈张力的对角线构图。

## 画面质感

加入运动模糊、水墨飞白和边缘颗粒感，突出猛烈冲撞与瞬间对峙的动态效果。`,
  },
  {
    id: "003",
    slug: "refraction",
    title: "折光",
    englishTitle: "REFRACTION",
    time: "2026/07/31",
    dimensions: "1254 × 1254 px",
    summary: "透明水彩把钻石切面拆成冰蓝、淡紫与微暖光谱，纤细墨线将流动色彩固定成一颗清晰的宝石。",
    tone: "light",
    media: {
      kind: "image",
      src: "/works/refraction.webp",
      alt: "暖象牙色纸面上，一颗由冰蓝与淡紫水彩叠染、精细墨线勾勒切面的钻石",
    },
    originalPrompt: `stylized-concept
Asset type: square standalone illustration
Primary request: Create a refined poster-like image centered on one unmistakable loose brilliant-cut diamond. The diamond itself is the clear subject, not an abstract symbol.
Scene/backdrop: warm ivory handmade paper with restrained open negative space; no environment or tabletop.
Subject: one oversized brilliant-cut diamond seen from a slightly elevated frontal view, occupying about 65% of the square canvas. Preserve the recognizable gemstone silhouette, crown, girdle, pavilion, and many precise intersecting facets. No ring, setting, jewelry, hands, flowers, or additional gemstones.
Style/medium: vintage mineralogical illustration rendered as transparent watercolor washes with delicate fine-line ink drawing. Layered pale ice blue, aqua, lavender, and subtle blush washes flow within the facets; thin charcoal-gray ink contours describe every facet. Visible paper absorption, soft pigment blooms, slight wash overlaps, and nuanced hand-painted irregularity. This is a 2D illustration, not photographic capture.
Composition/framing: fixed 1:1 poster composition; diamond centered and dominant, generous ivory margins, crisp complete silhouette. A few restrained prismatic watercolor glints radiate immediately around the stone as supporting accents, never becoming separate geometric objects.
Color/value: luminous near-white highlights, cool translucent blues and lavenders inside the diamond, sparse warm coral and gold prismatic accents, ivory background. Strong thumbnail readability and a clear dark-to-light facet rhythm.
Rendering: compressed depth and simplified illustrative light; faceted volume remains convincing through watercolor value shifts and fine ink geometry. Elegant, tactile, hand-rendered, editorial poster quality. Preserve organic watercolor texture and precise drawing detail.
Constraints: no text, no logo, no watermark, no border, no photorealistic studio lighting, no black background, no clean-vector flat fills, no minimalist abstract blocks.`,
  },
  {
    id: "004",
    slug: "verdant-notes",
    title: "林野札记",
    englishTitle: "VERDANT NOTES",
    time: "2026/07/31",
    dimensions: "3840 × 2160 px",
    summary:
      "蕨叶、桉枝与细碎白花在暖白棉纸上舒展，透明水色把一束林野植物留成轻盈、安静的纸上札记。",
    tone: "light",
    media: {
      kind: "image",
      src: "/works/verdant-notes.webp",
      alt: "暖白水彩纸上，蕨叶、圆叶桉与细碎白花交叠成一束舒展的绿色植物",
    },
    originalPrompt: `## 档案说明

原始 prompt 未随作品提供。`,
  },
] as const satisfies readonly Artwork[]
