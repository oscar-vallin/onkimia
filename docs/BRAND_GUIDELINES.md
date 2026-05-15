# Onkimia — Brand Guidelines (extracto)

Fuente: Manual de Identidad Oficial Onkimia (2024)

## Identidad de marca

**Nombre:** ONKIMIA — Evolución Oncológica  
**Significado:** ONCOS (griego, masa/tumor) + ALKIMIA (alquimia)  
**Concepto:** Espacio donde la oncología es trascendencia médica compartida

## Pilares institucionales

1. **Empatía** — vínculo médico-paciente. "Cuidamos, acompañamos y superamos juntos"
2. **Tecnología** — pilar básico en técnicas y tratamientos
3. **Profesionalismo** — seriedad, honradez, eficacia con el paciente como eje central

## Arquetipos

- **El Sabio** — estimula el aprendizaje, valora pensar, comparte conocimiento
- **El Cuidador/Protector** — afecto, soluciones de vida, foco en las personas

## Tono de voz

Profesional + humano + innovador + cálido. Lenguaje claro, sin tecnicismos innecesarios, con compasión.

## Paleta de colores oficial

### Primarios

| Token | HEX | Pantone | Uso |
|---|---|---|---|
| `brand-900` | `#1E1739` | P 101-16C | Fondos oscuros, navy oficial |
| `accent-500` | `#F39313` | P 24-7C | CTAs, acentos primarios |
| `accent-600` | `#F89420` | P 20-8U | Variante naranja claro |
| `purple-500` | `#662483` | P 93-8C | Acentos morados |
| `teal-500` | `#3DB59F` | P 127-13C | Verde-azulado decorativo |
| `sky-500` | `#36A9E7` | P 116-5C | Azul claro decorativo |

### Degradados oficiales

El manual incluye 6 degradados oficiales: morado, verde-azul, morado-naranja, verde-naranja, naranja, azules. Usar para fondos decorativos especiales.

## Tipografía

### Manual (uso impreso/branding)

- **Logotipo:** Good Times (licencia Typodermic — solo desktop/print)
- **Eslogan:** Source Code Variable
- **Secundaria:** Montserrat

### Web (este proyecto)

- **Display:** Orbitron (`--font-display`) — sustituto legal de Good Times
- **Body:** Montserrat (`--font-body`) — oficial del manual
- **Mono/tagline:** Source Code Pro (`--font-mono`) — equivalente a Source Code Variable

### Nota sobre Good Times

La licencia gratuita de Typodermic **NO permite** embed en web. Para usar Good Times en web se requiere:

- Comprar licencia web en typodermic.com (~$100 USD), o
- Usar Adobe Fonts (incluye fuentes derivadas)

Hasta que el cliente apruebe una opción, se usa **Orbitron** como sustituto legal y visualmente afín.

## Logo

- Logotipo + isotipo + eslogan = aplicación completa
- Isotipo NO usar solo (manual: "no tiene posicionamiento")
- Reducción mínima: 4cm × 2cm (sin eslogan)
- Versiones: degradados, plasta color, una tinta, blanco/negro

## Elementos visuales

Patrón decorativo: **círculos de colores con opacidad variable** simulando células/burbujas, evocando movimiento y dinamismo. Implementado como `<DecorativeBubbles />` en `src/components/ui/DecorativeBubbles.tsx`.
