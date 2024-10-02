# EBtheme Webapp

EBtheme Webapp is a material design template created based on a materially structured framework.

## Introduction

This project aims to provide a robust and customizable Webapp template using material design principles.

## Getting Started

### Prerequisite

- nodejs
- docker
- `npm` or `yarn` globally installed
- updated `.env`

### Installation Process

1. **Assuming Docker is already installed on your system.** <br />
	 Note: On ebtheme webapp `container` is set as `webapp` to update container goto **docker-compose.yml** file.
	 
    ```sh
    services:
      webapp:
        image: node:20.14.0-alpine
    ```
	When running commands replace `<container>` by `webapp`.

2. Create a Docker image:
    ```sh
    docker-compose up
    ```

3. Install node_modules :
    ```sh
    docker-compose run <container> yarn
    ```

4. Ensure you have the latest `.env` file in the root folder.

5. Start the server:
    ```sh
    docker-compose up
    ```

6. Open your browser and navigate to `localhost:8001` to view the project. <br/>
(Note: The port `8001` may be different. To update port, it is mention on docker-compose.yml file.)
    ```sh
    ports:
      - 8001:3000
    ```

7. Add packages to the project. Same as using yarn to add packages:
    ```sh
    docker compose run <container> yarn add <package name>
    ```

8. Build the project:
    ```sh
    docker compose run <container> yarn build
    ```

9. Preview the built project:
    ```sh
    docker compose run <container> yarn preview
    ```

10. Remove the `node_modules` folder from the Docker environment <br/>
    (Note: Docker must be running to execute this command.):
    ```sh
    docker exec -it <container-name> rm -rf node_modules
    ```

## Theme Setup

### Update General Theme Colors

#### Config File

To update generic styles like base fonts, border radius, shadows, menu orientation, theme mode, preset colors, languages, theme direction, container, and more that are used in the app.

##### File Path: `src/config.ts`

```js
const config: ConfigProps = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: poppins.style.fontFamily,
  borderRadius: 12,
  outlinedFilled: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: false
};
```

#### Set Generic Theme Colors

To update generic colors in the EBtheme webapp app.

Edit the `src/scss/_themes-vars.module.scss` file to change primary, secondary, success, error, orange, warning, and grey colors as per the design.

##### Code Sample

```scss
$paper: #ffffff;

// primary
$primaryLight: #e3f2fd;
$primaryMain: #2196f3;
$primaryDark: #0c74c7;
$primary200: #90caf9;
$primary800: #1565c0;

// secondary
$secondaryLight: #ede7f6;
$secondaryMain: #005da6;
$secondaryDark: #004b85;
```

### Use Case Theme Colors

1. `theme.palette.primary.main` in case of `theme.palette.grey[800]`
2. `<Typography color="grey.800">` (Only some elements support color props value as `<b>colorname.variant</b>`)
3. `<Button color="primary">`
4. Use the alpha built-in function `alpha(theme.palette.secondary.main, 0.50)` which returns CSS value as `rgba(0,0,0,0.50)`

### Adding New Custom Colors to the Theme

1. Edit `src/types/overrides/createPalette.d.ts` to add new color types as follows:

    ```ts
    interface ErrorPaletteColorOptions {
        500?: string;
    }

    interface ErrorPaletteColor {
        500: string;
    }

    interface PaletteOptions {
        orange?: PaletteColorOptions;
        dark?: PaletteColorOptions;
        icon?: IconPaletteColorOptions;
        error?: ErrorPaletteColorOptions;
    }

    interface Palette {
        orange: PaletteColor;
        dark: PaletteColor;
        icon: IconPaletteColor;
        error: ErrorPaletteColor;
    }
    ```

2. Update `src/themes/palette.tsx` to add the new color:

    ```ts
    error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark,
        500: colors.error500,
    },
    ```

3. Define hex color in `_themes-vars.module.scss` and export SCSS variable to JS:

    ```scss
    $errorDark: $orangeDark;
    $error500: #c1272d;
    ```

    Export to JS:

    ```js
    errorDark: $errorDark,
    error500: $error500,
    ```

4. Finalize in `palette.tsx`:

    ```ts
    error: {
        dark: colors.errorDark,
        500: colors.error500,
    },
    ```

### Theme Typography

To update typography, edit the `src/themes/typography.tsx` file. You can find a list of typography variants for headings (`h1` to `h6`), `body1`, `subtitle`, `caption`, and more. From here, you can set font size, font color, line heights, and more.

#### Use Case Typography

1. `theme.typography.body1.fontSize` can be used to set the `body1` font size where needed.
2. `<Typography variant="h1">` allows setting the variant of typography to `h1` to `h6`, `body1`, `subtitle`, and more.

### Adding Additional Typography

1. Go to the file `src/types/overrides/createTypography.d.ts` and add new variants:

    ```ts
    export type Variant =
        | 'largeAvatar'
        | 'body3'
        | 'body4';

    export interface TypographyOptions extends Partial<Record<Variant, TypographyStyleOptions> & FontStyleOptions> {
        largeAvatar?: TypographyStyleOptions;
        body3?: TypographyStyleOptions;
        body4?: TypographyStyleOptions;
    }

    export interface Typography extends Record<Variant, TypographyStyle>, FontStyle, TypographyUtils {
        largeAvatar: TypographyStyle;
        body3: TypographyStyle;
        body4: TypographyStyle;
    }
    ```

2. Then, go to the file `src/themes/typography.tsx` and add new variants as below:

    ```ts
    body3: {
        fontSize: '1.125rem'
    },
    body4: {
        fontSize: '0.75rem'
    },
    ```

### Update Generic Styles

To update generic styles of buttons, form elements, cards, chips, and so on, go to the file `compStyleOverrides.tsx`.

#### Code Sample

```js
MuiButton: {
    styleOverrides: {
        root: {
            fontWeight: 500,
            borderRadius: '36px',
            '&.pagination-button': {
                border: `1px solid ${theme.palette.grey[50]}`,
                borderRadius: 0,
                padding: '12px 20px 12px 15px',
                color: theme.palette.grey[900]
            },
        },
        sizeMedium: {
            padding: '9px 24px',
            lineHeight: 'calc(20 / 14)'
        },
        sizeLarge: {
            fontSize: theme.typography.body1.fontSize,
            lineHeight: 'calc(23 / 16)',
            padding: '16px 24px'
        },
        startIcon: {
            marginLeft: 0,
            marginRight: 16
        }
    }
},
```

In the above code, generic button styles are updated for size `medium`, `large`, buttons with a `start icon`, and styling using the className `.pagination-button`.

You can update similarly for other elements and components.

#### Update custom icon checkbox code sample 
```js
MuiCheckbox: {
    styleOverrides: {
        root: {
            color: 'default', // Custom color when unchecked
            '&.Mui-checked': {
            color: 'primary' // Custom color when checked
            }
        }
    },
    defaultProps: {
        icon: <SquareBoxIcon />, // Custom unchecked icon
        checkedIcon: <SquareBoxCheckedIcon /> // Custom checked icon
    }
},
```