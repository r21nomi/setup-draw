/**
 * https://docs.artblocks.io/creator-docs/creator-onboarding/readme/
 */
import {util} from "~/util"

class Random {
  private hash: string
  private useA: boolean
  private prngA: any
  private prngB: any

  constructor(hash) {
    this.hash = hash
    this.useA = false
    const Sfc32: any = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16)
      let b = parseInt(uint128Hex.substr(8, 8), 16)
      let c = parseInt(uint128Hex.substr(16, 8), 16)
      let d = parseInt(uint128Hex.substr(24, 8), 16)
      return function () {
        a |= 0
        b |= 0
        c |= 0
        d |= 0
        const t = (((a + b) | 0) + d) | 0
        d = (d + 1) | 0
        a = b ^ (b >>> 9)
        b = (c + (c << 3)) | 0
        c = (c << 21) | (c >>> 11)
        c = (c + t) | 0
        return (t >>> 0) / 4294967296
      }
    }
    // seed prngA with first half of tokenData.hash
    this.prngA = new Sfc32(this.hash.substr(2, 32))
    // seed prngB with second half of tokenData.hash
    this.prngB = new Sfc32(this.hash.substr(34, 32))
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA()
      this.prngB()
    }
  }

  // random number between 0 (inclusive) and 1 (exclusive)
  randomDec() {
    this.useA = !this.useA
    return this.useA ? this.prngA() : this.prngB()
  }

  // random number between a (inclusive) and b (exclusive)
  randomNum(a, b) {
    return a + (b - a) * this.randomDec()
  }

  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  randomInt(a, b) {
    return Math.floor(this.randomNum(a, b + 1))
  }

  // random boolean with p as percent liklihood of true
  randomBool(p) {
    return this.randomDec() < p
  }

  // random value in an array of items
  randomChoice(list) {
    return list[this.randomInt(0, list.length - 1)]
  }

  shuffleWithSeed(array) {
    let m = array.length

    while (m) {
      const i = Math.floor(this.randomDec() * m--)
      const t = array[m]
      array[m] = array[i]
      array[i] = t
    }
    return array
  }
}

const getRandomHash = () => {
  let result = "0x"
  for (let i = 0; i < 64; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

export class Feature {
  public static SHAPE: any = {
    RECT: "square",
    ELLIPSE: "circle",
    TRIANGLE: "triangle",
  }

  public static VARIABLES = {
    BAR_RADIUS: 4,
    BG_RADIUS: 6,
  }

  public static PAINTER = {
    RANDOM_WALKER: "random walker",
    SCANNER: "scanner",
    SCANNER2: "scanner 2",
    LINEAR_MACHINE: "linear machine",
  }

  // For debug
  private devVariables = {
    palettes: [
      "0100a8-58a8a9-bfc7c8-a9aeb1-0a0919",
      "e6e6e6-6ccbf9-dbd5d9-4f8cdc-ffffff-e8e8e8",
      "455354-f8f8f2-1b1d1e-f92672-a6e22e-ae81ff",
      "313633-ccdc90-7f9f7f-3f3f3f-e3ceab-dcdccc",
      "818596-17171b-89b8c2-84a0c6-c6c8d1-a093c7",
      "504945-ebdbb2-282828-fb4934-83a598-b8bb26",
      "88c0d0-4c566a-2e3440-81a1c1-d8dee9-b48ead",
      "000000-424450-bd93f9-ff79c6-f8f8f2-50fa7b",
      "f8f8f2-66747f-2b3e50-ff6541-66d9ef-5c98cd",
      "ebefc0-232738-0e101a-795ccc-5a5f7b-aeb18d",
      "80cbc4-546e7a-263238-ffffff-c792ea-82b1ff",
      "f7f9f9-121424-54c9ff-e9729f-a2a0df-7e7e7e",
      "87afff-1c1c1c-ffffff-00afff-c6c6c6-ffaf5f",
      "eeeeee-005f5f-002b36-8787af-ffdf87-87afaf",
      "ee5d43-5f6167-23262e-ffffff-c74ded-00e8c6",
      "b7c5d3-171d23-5ec4ff-b7c5d3-718ca1-70e1e8",
      // https://vimcolorschemes.com/ghifarit53/daycula-vim
      "1a1d45-d7b7bb-ff4ea5-6cac99-eaad64-7eb564"
    ],
    shapes: [
      Feature.SHAPE.ELLIPSE,
      Feature.SHAPE.RECT,
      Feature.SHAPE.TRIANGLE
    ]
  }

  private random: any
  private attributes: any
  private paletteColors: any[]

  constructor() {
    const _hash = getRandomHash()
    this.random = new Random(_hash)

    // Generate attributes if not provided
    const memoryDiscAttribute = {
      hash: _hash,
      palette: this.random.randomChoice(this.devVariables.palettes),
      image: "",
      shape: this.random.randomChoice(this.devVariables.shapes),
      speed: this.random.randomInt(1, 100),
      size: this.random.randomInt(1, 100),
      weight: this.random.randomInt(1, 100),
      offset: this.random.randomInt(1, 100),
      dynamic: this.random.randomBool(0.9),
    }
    this.attributes = Object.assign({}, memoryDiscAttribute)

    this.attributes.speed = util.map(this.attributes.speed, 0, 100, 0.2, 1.0)
    this.attributes.size = util.map(this.attributes.size, 0, 100, 0.2, 1.0)
    this.attributes.weight = Math.floor(util.map(this.attributes.weight, 0, 100, 0, 3))
    this.attributes.offset = Math.floor(util.map(this.attributes.offset, 0, 100, 6, 10))
    this.attributes.stroke = this.random.randomBool(0.3)

    this.paletteColors = this.random.shuffleWithSeed(this.getPalette())

    console.log(this.attributes)
  }

  getPalette(): string[] {
    return this.attributes.palette.split('-').map((hex) => '#' + hex)
  }

  getSpeed(): number {
    return util.map(this.random.randomInt(1, 100), 0, 100, 0.2, 1.0) * this.attributes.speed
  }

  getColors() {
    const palette = this.paletteColors
    return {
      background: palette[0],
      jacket: palette[1],
      frame: palette[2],
      stroke: `#333`
    }
  }

  getPaletteAsRGB () {
    return util.getHexColors(this.attributes.palette).map(hex => util.convertHexToRGB(hex))
  }

  getFrequency() {
    return Math.floor(util.map(this.attributes.speed, 0, 1, 4, 2))
  }

  getColor(index: number) {
    const palette = this.paletteColors
    return palette[index % palette.length]
  }
}
