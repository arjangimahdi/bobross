import { BobRoss } from '@/main'

const elem = document.getElementById('canvas')

const bob = new BobRoss(elem as HTMLCanvasElement)

bob.init()