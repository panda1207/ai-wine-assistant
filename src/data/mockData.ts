import { Product, Message, QuickReply } from '../types';

export const mockProduct: Product = {
  id: '1',
  name: 'Château Margaux 2015',
  winery: 'Château Margaux',
  region: 'Margaux, Bordeaux, France',
  vintage: 2015,
  price: 899.99,
  rating: 4.8,
  reviewCount: 127,
  images: [
    'https://manager.chateau-margaux.com/wp-content/uploads/2017/11/chr_2017_11_13_hp-2-652x458.jpg',
    'https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/34/2017/11/margaux-2015-limited-release.jpg',
    'https://www.lagunacellar.com/media/catalog/product/m/a/margaux-2015x6.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=',
  ],
  inStock: true,
  stockCount: 12,
  description: 'A magnificent expression of the 2015 vintage from one of Bordeaux\'s most prestigious estates. This wine showcases the perfect balance of power and elegance that Château Margaux is renowned for.',
  varietal: 'Bordeaux Blend (Cabernet Sauvignon, Merlot, Petit Verdot)',
  alcoholContent: 13.5,
  bottleSize: '750ml',
  tastingNotes: [
    {
      category: 'Aroma',
      notes: ['Blackcurrant', 'Violet', 'Cedar', 'Graphite', 'Tobacco']
    },
    {
      category: 'Palate',
      notes: ['Rich dark fruits', 'Silky tannins', 'Mineral notes', 'Long finish']
    },
    {
      category: 'Body',
      notes: ['Full-bodied', 'Well-structured', 'Age-worthy']
    }
  ],
  pairings: ['Grilled ribeye steak', 'Lamb rack', 'Aged cheeses', 'Beef Wellington'],
  expertReview: 'This is a stunning wine that captures the essence of the 2015 vintage. Showing remarkable depth and complexity, with layers of dark fruit, floral notes, and classic Margaux elegance. The tannins are refined and the finish is incredibly long. While approachable now, this wine will continue to develop beautifully over the next 20-30 years.',
  provenance: 'Sourced directly from the château, stored in temperature-controlled facilities since release. Complete provenance documentation available.',
  badges: ['95+ Points', 'Critic\'s Choice', 'Limited Allocation']
};

export const mockProducts: Product[] = [
  mockProduct,
  {
    id: '2',
    name: 'Penfolds Grange 2018',
    winery: 'Penfolds',
    region: 'Barossa Valley, Australia',
    vintage: 2018,
    price: 749.99,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://lieblings-weine.de/wp-content/uploads/2024/10/penfolds_bin_95_grange_2018_m_schubert_gepa_bottle_lieblings-weine.jpg',
    ],
    inStock: true,
    stockCount: 8,
    description: 'Australia\'s most iconic wine, the Grange is a testament to Penfolds\' winemaking excellence.',
    varietal: 'Shiraz',
    alcoholContent: 14.5,
    bottleSize: '750ml',
    tastingNotes: [
      {
        category: 'Aroma',
        notes: ['Blackberry', 'Plum', 'Mocha', 'Spice']
      }
    ],
    pairings: ['Braised short ribs', 'Venison'],
    badges: ['97 Points']
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I\'m your wine assistant. How can I help you find the perfect wine today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    text: 'I\'m looking for a special Bordeaux for a dinner party',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    text: 'Great choice! I have some excellent Bordeaux options for you. What\'s your budget range and what will you be serving?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '4',
    text: 'Around $800-1000, serving beef Wellington',
    sender: 'user',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '5',
    text: 'Perfect! I recommend the Château Margaux 2015. It\'s a stunning wine that pairs beautifully with beef Wellington. The wine has exceptional depth, silky tannins, and the 2015 vintage is considered one of the best in recent years.',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 60000),
    productReference: '1'
  }
];

export const quickReplies: QuickReply[] = [
  { id: '1', text: 'Tell me more' },
  { id: '2', text: 'View details' },
  { id: '3', text: 'Other options?' },
  { id: '4', text: 'What food pairs well?' }
];

export const recommendedProducts: Product[] = [
  {
    id: '3',
    name: 'Opus One 2018',
    winery: 'Opus One',
    region: 'Napa Valley, California',
    vintage: 2018,
    price: 449.99,
    rating: 4.6,
    reviewCount: 156,
    images: ['https://winescout.com.sg/cdn/shop/files/OPUSONE2.jpg?v=1714555266&width=1445'],
    inStock: true,
    description: 'A Napa Valley icon, blending Bordeaux tradition with California innovation.',
    varietal: 'Bordeaux Blend',
    alcoholContent: 14.5,
    bottleSize: '750ml',
    tastingNotes: [{ category: 'Palate', notes: ['Blackberry', 'Cassis', 'Vanilla'] }],
    pairings: ['Prime rib', 'Duck confit'],
    badges: ['94 Points']
  },
  {
    id: '4',
    name: 'Sassicaia 2017',
    winery: 'Tenuta San Guido',
    region: 'Bolgheri, Tuscany, Italy',
    vintage: 2017,
    price: 349.99,
    rating: 4.7,
    reviewCount: 92,
    images: ['https://www.terredimare.com/wp-content/uploads/2021/04/DSC00003-scaled.jpg'],
    inStock: true,
    description: 'The wine that started the Super Tuscan revolution.',
    varietal: 'Cabernet Sauvignon',
    alcoholContent: 13.5,
    bottleSize: '750ml',
    tastingNotes: [{ category: 'Aroma', notes: ['Cassis', 'Herbs', 'Mediterranean scrub'] }],
    pairings: ['Tuscan steak', 'Wild boar'],
    badges: ['96 Points', 'Super Tuscan']
  }
];
