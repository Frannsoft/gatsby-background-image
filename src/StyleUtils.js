import { toKebabCase } from './HelperUtils'

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props
 * @return {Object}
 */
export const fixOpacity = props => {
  let styledProps = { ...props }

  try {
    if (styledProps.style && styledProps.style.opacity) {
      if (
        isNaN(styledProps.style.opacity) ||
        styledProps.style.opacity > 0.99
      ) {
        styledProps.style.opacity = 0.99
      }
    }
  } catch (e) {}

  return styledProps
}

/**
 * Set some needed backgroundStyles.
 *
 * @return {Object}
 * @param backgroundStyles
 */
export const presetBackgroundStyles = backgroundStyles => {
  const defaultBackgroundStyles = {
    backgroundPosition: `center`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `cover`,
  }

  return { ...defaultBackgroundStyles, ...backgroundStyles }
}

/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId
 * @param transitionDelay
 * @param bgImage
 * @param lastImage
 * @param nextImage
 * @param afterOpacity
 * @param bgColor
 * @param fadeIn
 * @param backgroundStyles
 * @return {string}
 */
export const createPseudoStyles = ({
  classId,
  transitionDelay,
  bgImage,
  lastImage,
  nextImage,
  afterOpacity,
  bgColor,
  fadeIn,
  backgroundStyles,
}) => {
  return `
          .gatsby-background-image-${classId}:before,
          .gatsby-background-image-${classId}:after {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            ${vendorPrefixBackgroundStyles(transitionDelay, fadeIn)}
            ${kebabifyBackgroundStyles(backgroundStyles)}
          }
          .gatsby-background-image-${classId}:before {
            z-index: -100;
            ${
              !afterOpacity && lastImage !== ``
                ? `background-image: url(${lastImage});`
                : ``
            }
            ${
              afterOpacity && (nextImage || bgImage)
                ? `background-image: url(${nextImage || bgImage});`
                : ``
            }
            ${bgColor && `background-color: ${bgColor};`}
            opacity: ${afterOpacity}; 
          }
          .gatsby-background-image-${classId}:after {
            z-index: -101;
            ${
              afterOpacity && lastImage !== ``
                ? `background-image: url(${lastImage});`
                : ``
            }
            ${
              !afterOpacity && (bgImage || nextImage)
                ? `background-image: url(${bgImage || nextImage});`
                : ``
            }
            ${bgColor && `background-color: ${bgColor};`}
          }
        `
}

/**
 * Creates vendor prefixed background styles.
 *
 * @param transitionDelay
 * @param fadeIn
 * @return {string}
 */
export const vendorPrefixBackgroundStyles = (
  // backgroundSize = `cover`,
  transitionDelay = `0.25s`,
  fadeIn = true
) => {
  // Remove vendor-prefixes for the moment...
  /*
  const vendorPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '']
  let prefixed = vendorPrefixes
    .join(`background-size: ${backgroundSize};\n`)
    .concat(`background-size: ${backgroundSize};\n`)
  if (fadeIn) {
    prefixed +=
      vendorPrefixes
        .join(`transition-delay: ${transitionDelay};\n`)
        .concat(`transition-delay: ${transitionDelay};\n`) +
      vendorPrefixes
        .join(`transition: opacity 0.5s;\n`)
        .concat(`transition: opacity 0.5s;\n`)
  } else {
    prefixed += vendorPrefixes
      .join(`transition: none;\n`)
      .concat(`transition: none;\n`)
  }
  */
  let prefixed = fadeIn
    ? `transition-delay: ${transitionDelay};
            transition: opacity 0.5s;`
    : `transition: none;`
  return prefixed
}

/**
 * Converts a style object into CSS kebab-cased style rules.
 *
 * @param styles
 * @return {*}
 */
export const kebabifyBackgroundStyles = styles => {
  if (
    styles instanceof Object ||
    styles instanceof String ||
    typeof styles === 'string'
  ) {
    if (styles instanceof String || typeof styles === 'string') {
      return styles
    } else {
      return Object.keys(styles)
        .filter(key => key.indexOf('background') === 0 && styles[key] !== '')
        .reduce(
          (resultingStyles, key) =>
            `${resultingStyles}${toKebabCase(key)}: ${styles[key]};\n`,
          ``
        )
    }
  }
  return ``
}
