# Typography Classes Migration

The typography styles from `livoFonts.ts` have been migrated to Tailwind CSS custom component classes in `tailwind.config.js`.

## Usage

### Using Typography Component (Recommended)

```jsx
import { Typography } from '@/components/atoms/Typography';

// Heading variants
<Typography variant="heading/xLarge">Extra Large Heading</Typography>
<Typography variant="heading/large">Large Heading</Typography>
<Typography variant="heading/medium">Medium Heading</Typography>
<Typography variant="heading/small">Small Heading</Typography>

// Subtitle variants
<Typography variant="subtitle/xLarge">Extra Large Subtitle</Typography>
<Typography variant="subtitle/regular">Regular Subtitle</Typography>
<Typography variant="subtitle/small">Small Subtitle</Typography>

// Body variants
<Typography variant="body/large">Large body text</Typography>
<Typography variant="body/regular">Regular body text</Typography>
<Typography variant="body/small">Small body text</Typography>

// Action variants
<Typography variant="action/regular">Regular Action Text</Typography>
<Typography variant="action/small">Small Action Text</Typography>

// Info variants
<Typography variant="info/caption">Caption text</Typography>
<Typography variant="info/overline">Overline text</Typography>

// Link variants
<Typography variant="link/regular">Regular Link</Typography>
<Typography variant="link/small">Small Link</Typography>

// With additional props
<Typography
  variant="heading/large"
  color="#FF0000"
  align="center"
  decoration="underline"
  className="my-custom-class"
>
  Customized Typography
</Typography>
```

### Typography Component Props

- `variant`: Required. Format: `{type}/{size}` (e.g., "heading/large", "body/regular")
- `color`: Optional. Custom color override
- `align`: Optional. Text alignment ("inherit", "left", "right", "center", "justify")
- `decoration`: Optional. Text decoration ("none", "underline", "line-through", "underline line-through")
- `className`: Optional. Additional CSS classes
- All other MUI Typography props are supported

## Available Classes

### Heading Classes

- `heading/xLarge` - 32px, bold, 40px line-height
- `heading/large` - 27px, bold, 36px line-height
- `heading/medium` - 23px, bold, 32px line-height
- `heading/small` - 19px, bold, 24px line-height

### Subtitle Classes

- `subtitle/xLarge` - 23px, medium, 28px line-height
- `subtitle/regular` - 16px, medium, 24px line-height
- `subtitle/small` - 13px, medium, 20px line-height

### Body Classes

- `body/large` - 19px, regular, 28px line-height
- `body/regular` - 16px, regular, 24px line-height
- `body/small` - 13px, regular, 16px line-height

### Action Classes

- `action/regular` - 16px, medium, 16px line-height, 0.25px letter-spacing
- `action/small` - 13px, medium, 16px line-height, 0.2px letter-spacing

### Info Classes

- `info/caption` - 13px, regular, 20px line-height
- `info/overline` - 11px, regular, 16px line-height

### Link Classes

- `link/regular` - 15px, medium, 24px line-height, 0.25px letter-spacing, blue color
- `link/small` - 13px, medium, 20px line-height, blue color

## Alternative Usage Methods

### Direct Class Usage

```jsx
<h1 className="heading/large">Large Heading</h1>
<p className="body/regular">Regular body text</p>
<button className="action/regular">Button Text</button>
<a href="#" className="link/regular">Link Text</a>
```

### Using the Helper Functions

```jsx
import { getTypographyClass, typographyClasses } from './styles/typographyClasses';

// Using helper function
<h1 className={getTypographyClass('heading', 'large')}>Large Heading</h1>

// Using constants
<p className={typographyClasses.body.regular}>Regular body text</p>
```

## Migration from livoFonts.ts

### Before (using typographyStyles object)

```jsx
const headingStyle = typographyStyles.heading.large;
// Apply styles via JavaScript object
```

### After (using Tailwind classes)

```jsx
<h1 className="heading/large">Heading Text</h1>
// Or using helper
<h1 className={typographyClasses.heading.large}>Heading Text</h1>
```

The new approach provides better performance, smaller bundle size, and better integration with Tailwind CSS utilities.
