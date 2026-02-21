# Digital Factory Chart

An interactive organizational chart visualization tool that converts Excel spreadsheets into beautiful, hierarchical org charts with advanced features like collapsible nodes, project grouping, and animated cascade effects.

## Features

- 📊 **Interactive Org Chart** - Beautiful hierarchical visualization of organizational structures
- 🎨 **Color-Coded Projects** - Each project group has a unique color for easy identification
- 🎯 **Collapsible Nodes** - Click to expand/collapse organization units to focus on specific areas
- ✨ **Cascade Animations** - Smooth level-by-level animation on initial load
- 📱 **Responsive Canvas** - Pan, zoom, and explore the chart with intuitive controls
- 🗺️ **Minimap** - Quick navigation overview of the entire org structure

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The app will be compiled to the `dist` folder and automatically deployed to GitHub Pages when you push to the `main` branch thanks to GitHub Actions.

### Manual Deployment

If you need to deploy manually:

```bash
npm run deploy
```

This will build and push the `dist` folder to the `gh-pages` branch.

## How to Use

### Uploading an Excel File

1. Click the **"Upload Excel"** button in the navbar
2. Select an Excel file (.xlsx, .xls, .xlsm) with employee data
3. The org chart will animate into view automatically

### Excel File Format

Your Excel file should contain the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| Employee Name | ✅ | Name of the person |
| Email | ❌ | Email address (optional) |
| Level | ❌ | Job title or level (optional) |
| Project | ✅ | Project assignment |
| Org Unit 1 | ✅ | Top-level organization |
| Org Unit 2-5 | ❌ | Nested organizational levels (optional) |

**Example:**
```
Employee Name,Email,Level,Project,Org Unit 1,Org Unit 2,Org Unit 3
John Doe,john@example.com,Senior Manager,ProjectA,Sales,EMEA,France
Jane Smith,jane@example.com,Developer,ProjectB,Engineering,Frontend,UI Team
```

### Interactive Features

#### Collapse/Expand Organization Units
- Click the **▼** button on any org unit to collapse it
- Click the **▶** button to expand it again
- Collapsing hides all subordinate units and related people

#### Color-Coded Project Groups
- Each project group has a unique color background
- People within a project group use the same color for visual connection
- Easily identify team members by project

#### Navigation
- **Zoom**: Use mouse wheel or trackpad pinch gesture
- **Pan**: Click and drag to move around the chart
- **Fit View**: Double-click to auto-center the view
- **Minimap**: Click on the minimap (bottom-right) for quick navigation

#### Help
- Click the **?** button in the navbar for detailed instructions and formatting guidelines

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── main.tsx               # React entry point
├── styles.css             # Global styles
└── org/
    ├── buildGraph.ts      # Convert Excel data to graph structure
    ├── layout.ts          # Position nodes using Dagre algorithm
    ├── nodes.tsx          # React components for chart nodes
    ├── types.ts           # TypeScript type definitions
    └── settings.ts        # Centralized configuration
```

## Technology Stack

- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.4 - Type-safe JavaScript
- **React Flow** 12.4.4 - Interactive graph visualization
- **Dagre** 1.0.5 - Hierarchical graph layout
- **XLSX** 0.18.5 - Excel file parsing
- **Vite** - Fast build tool and dev server

## Customization

### Modify Colors

Edit `src/org/settings.ts` to change project colors or layout spacing:

```typescript
export const PROJECT_COLORS = [
  '#ffc289', // Light orange
  '#95c8ff', // Light blue
  // ... add or modify colors
];
```

### Adjust Layout Spacing

Modify `LAYOUT_SPACING` in `src/org/settings.ts`:

```typescript
export const LAYOUT_SPACING = {
  INTER_PROJECT_SPACING: 60,
  PROJECT_TOP_PADDING: 60,
  PROJECT_SIDE_PADDING: 25,
  INITIAL_Y_OFFSET: 60,
};
```

## Performance Tips

- For large organizations (1000+ people), consider filtering Excel data before upload
- Use the collapse feature to focus on specific organizational areas
- Cascade animation delays can be customized in `src/org/nodes.tsx`

## Troubleshooting

### Chart Not Loading
- Verify Excel file has required columns: "Employee Name", "Project", "Org Unit 1"
- Check browser console for error messages

### Nodes Overlapping
- Increase `INITIAL_Y_OFFSET` in settings to add more vertical spacing
- Adjust `ranksep` in `DAGRE_CONFIG` for better hierarchical spacing

## Privacy & Security

- All data processing happens entirely in your browser
- Excel files are never uploaded to any server
- No data is stored or transmitted

---

**Created for:** Accenture Digital Factory
