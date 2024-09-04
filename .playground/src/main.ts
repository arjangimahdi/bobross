import { BobRoss } from '@/main'

const elem = document.getElementById('canvas')
const zoomInBtn = document.getElementById('zoomin')
const zoomOutBtn = document.getElementById('zoomout')

const bob = new BobRoss()

bob.init(elem as HTMLCanvasElement)

zoomInBtn?.addEventListener('click', () => {
  bob.zoom(1.5)
})
zoomOutBtn?.addEventListener('click', () => {
  bob.zoom(0.5)
})