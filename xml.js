class XML {
  constructor(doc, attributes) {
    this.doc = doc
    this.attributes = attributes
  }

  tags(value) {
    return this.doc.getElementsByTagName(value)
  }
}

let mapXML
const tileSets = []
const xhr = new XMLHttpRequest()
xhr.open("GET", "./data/map.xml")
xhr.send()

const promises = []

promises.push(
  new Promise((resolve, reject) => {
    xhr.onload = () => {
      const domParser = new DOMParser()
      const doc = domParser.parseFromString(xhr.responseText, "application/xml")
      mapXML = new XML(doc)
      //console.log(mapXML);
      const tilesets = mapXML.tags("tileset")
      Object.values(tilesets).forEach((tileset) => {
        //console.log(tileset)
        const src = tileset.getAttribute("source")
        //console.log(src)
        const srcXml = src.replace("tsx", "xml")
        //console.log(srcXml)
        const newxhr = new XMLHttpRequest()
        newxhr.open("GET", `./data/${srcXml}`)
        newxhr.send()
        promises.push(
          new Promise((resolve, reject) => {
            newxhr.onload = () => {
              const newdomParser = new DOMParser()
              const newdoc = newdomParser.parseFromString(
                newxhr.responseText,
                "application/xml"
              )
              //console.log(newdoc)
              const collection = newdoc.getElementsByTagName("tileset").item(0)
              //console.log(collection)

              const firstgid = tileset.getAttribute("firstgid")
              const source = srcXml
              const name = collection.getAttribute("name")
              const tileWidth = collection.getAttribute("tilewidth")
              const tileHeight = collection.getAttribute("tileheight")
              const tileCount = collection.getAttribute("tilecount")
              const columns = collection.getAttribute("columns")
              const images = newdoc.getElementsByTagName("image")
              tileSets.push(
                new TileSet(
                  firstgid,
                  source,
                  name,
                  tileWidth,
                  tileHeight,
                  tileCount,
                  columns,
                  images
                )
              )
              //console.log(firstgid, source, name, tileWidth, tileHeight, tileCount, columns, images);
              resolve(true)
            }
          })
        )
      })
      resolve(true)
    }
  })
)
