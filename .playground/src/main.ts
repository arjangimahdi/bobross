import { BobRoss } from '@/main'

const elem = document.getElementById('canvas')

const bob = new BobRoss()

bob.init(elem as HTMLCanvasElement)